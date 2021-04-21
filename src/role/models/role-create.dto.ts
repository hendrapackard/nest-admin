import {ArrayNotEmpty, IsNotEmpty} from "class-validator";

export class RoleCreateDto {
    @IsNotEmpty()
    name: string;

    @ArrayNotEmpty()
    permissions: number[]
}