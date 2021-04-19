import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "./models/user.entity";
import * as bcrypt from 'bcrypt';
import {UserCreateDto} from "./models/user-create.dto";
import {AuthGuard} from "../auth/auth.guard";

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Get()
    async all(): Promise<User[]> {
        return this.userService.all();
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User> {
        if (await this.userService.findOne({email: body.email})) {
            throw new BadRequestException(['email has already been taken']);
        }

        const password = await bcrypt.hash('1234', 12);
        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password
        });
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return this.userService.findOne({id});
    }
}
