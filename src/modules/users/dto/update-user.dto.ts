import { IsAlpha, IsAlphanumeric, IsEmail, IsOptional, Matches, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsAlpha()
    first_name: string;

    @IsOptional()
    @IsAlpha()
    last_name: string;

    @IsOptional()
    @MinLength(6)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    password: string;

    @IsOptional()
    @MinLength(6)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    confirm_password: string;
}