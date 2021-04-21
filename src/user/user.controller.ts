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
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "./models/user.entity";
import * as bcrypt from 'bcrypt';
import {UserCreateDto} from "./models/user-create.dto";
import {AuthGuard} from "../auth/auth.guard";
import {Not} from "typeorm";

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Get()
    async all(@Query('page') page = 1) {
        return this.userService.paginate(page, ['role']);
    }

    @Post()
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
    async get(@Param('id') id: number) {
        return this.userService.findOneOrNotFound({id}, ['role']);
    }

    @Put(':id')
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
    async delete(@Param('id') id: number) {
        const data = await this.userService.findOneOrNotFound({id});

        await this.userService.delete(id);

        return data;
    }
}
