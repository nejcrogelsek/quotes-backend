import { IsAlpha, IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    profile_image: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsAlpha()
    first_name: string;

    @IsNotEmpty()
    @IsAlpha()
    last_name: string;

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    password: string;

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    confirm_password: string;
}