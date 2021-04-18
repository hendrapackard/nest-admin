import {Controller, Get} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "./models/user.entity";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Get()
    async all(): Promise<User[]> {
        return await this.userService.all();
    }
}
