import { IsAlpha, IsAlphanumeric, IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsAlpha()
    first_name: string;

    @IsAlpha()
    last_name: string;

    @IsAlphanumeric()
    @MinLength(6)
    password: string;

    confirm_password: string;
}