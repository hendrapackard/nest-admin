import {IsNotEmpty} from "class-validator";

export class UserUpdateInfoDto {
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;
}