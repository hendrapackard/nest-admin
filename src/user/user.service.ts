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

    async findOneOrNotFound(condition): Promise<User> {
        const user = await this.userRepository.findOne(condition);
        if (!user) {
            throw new NotFoundException('Data not found');
        }
        return user;
    }

    async findOne(condition): Promise<User> {
        return this.userRepository.findOne(condition);
    }

    async update(id: number, data): Promise<any> {
        return this.userRepository.update(id, data);
    }

    async delete(id: number): Promise<any> {
        return this.userRepository.delete(id);
    }
}
