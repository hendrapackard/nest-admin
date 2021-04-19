import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./models/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
    }

    async all(): Promise<User[]> {
        return this.userRepository.find();
    }

    async create(data): Promise<User> {
        return this.userRepository.save(data);
    }

    async findOne(condition): Promise<User> {
        const user = await this.userRepository.findOne(condition);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}
