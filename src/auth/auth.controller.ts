import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt';
import {RegisterDto} from "./models/register.dto";
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from "express";
import {AuthGuard} from "./auth.guard";
import {LoginDto} from "./models/login.dto";
import {RoleService} from "../role/role.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private jwtService: JwtService
    ) {
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if (body.password !== body.password_confirm) {
            throw new BadRequestException(['password do not match']);
        }

        if (await this.userService.findOne({email: body.email})) {
            throw new BadRequestException(['email has already been taken']);
        }

        const hashed = await bcrypt.hash(body.password, 12);

        const roleAdmin = await this.roleService.findOne({name: 'Admin'})

        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed,
            role: {id: roleAdmin.id}
        });
    }

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.userService.findOneOrNotFound({email: body.email});

        if (!await bcrypt.compare(body.password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({id: user.id});

        response.cookie('jwt', jwt, {httpOnly: true});

        return user;
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
        const cookie = request.cookies['jwt'];

        const data = await this.jwtService.verifyAsync(cookie);

        return this.userService.findOne({id: data['id']});
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'Success'
        }
    }
}
