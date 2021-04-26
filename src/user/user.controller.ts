import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "./models/user.entity";
import * as bcrypt from 'bcrypt';
import {UserCreateDto} from "./models/user-create.dto";
import {AuthGuard} from "../auth/auth.guard";
import {Not} from "typeorm";
import {AuthService} from "../auth/auth.service";
import {Request} from "express";
import {UserUpdateInfoDto} from "./models/user-update-info.dto";
import {UserUpdatePasswordDto} from "./models/user-update-password.dto";
import {HasPermission} from "../permission/has-permission.decorator";

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {
    }

    @Get()
    @HasPermission('users')
    async all(@Query('page') page = 1) {
        return this.userService.paginate(page, ['role']);
    }

    @Post()
    @HasPermission('users')
    async create(@Body() body: UserCreateDto): Promise<User> {
        if (await this.userService.findOne({email: body.email})) {
            throw new BadRequestException(['email has already been taken']);
        }

        const {role_id, ...data} = body;

        const password = await bcrypt.hash('Secret123!', 12);
        return this.userService.create({
            ...data,
            password,
            role: {id: role_id}
        });
    }

    @Get(':id')
    @HasPermission('users')
    async get(@Param('id') id: number) {
        return this.userService.findOneOrNotFound({id}, ['role']);
    }

    @Put('info')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UserUpdateInfoDto
    ) {
        const id = await this.authService.userId(request);
        await this.userService.update(id, body);

        return this.userService.findOne({id});
    }

    @Put('password')
    async updatePassword(
        @Req() request: Request,
        @Body() body: UserUpdatePasswordDto
    ) {
        if (body.password !== body.password_confirm) {
            throw new BadRequestException(['password do not match']);
        }

        const id = await this.authService.userId(request);

        const hashed = await bcrypt.hash(body.password, 12);

        await this.userService.update(id, {
            password: hashed
        });

        return this.userService.findOne({id});
    }

    @Put(':id')
    @HasPermission('users')
    async update(
        @Param('id') id: number,
        @Body() body: UserCreateDto
    ) {
        await this.userService.findOneOrNotFound({id});

        if (await this.userService.findOne({email: body.email, id: Not(id)})) {
            throw new BadRequestException(['email has already been taken']);
        }

        const {role_id, ...data} = body;

        await this.userService.update(id, {
            ...data,
            role: {id: role_id}
        });

        return this.userService.findOne({id});
    }

    @Delete(':id')
    @HasPermission('users')
    async delete(@Param('id') id: number) {
        const data = await this.userService.findOneOrNotFound({id});

        await this.userService.delete(id);

        return data;
    }
}
