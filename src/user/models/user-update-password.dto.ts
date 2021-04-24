import {IsNotEmpty, Matches} from "class-validator";

export class UserUpdatePasswordDto {
    @IsNotEmpty()
    @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$', '', {
        message: 'password must be more than 8 characters long, should contain at-least 1 uppercase, 1 lowercase, 1 numeric and 1 special character.'
    })
    password: string;

    @IsNotEmpty()
    password_confirm: string;
}