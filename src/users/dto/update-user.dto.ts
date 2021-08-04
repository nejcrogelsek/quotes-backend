import { IsAlpha, IsAlphanumeric, IsEmail, IsOptional, MinLength } from "class-validator";

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
    @IsAlphanumeric()
    @MinLength(6)
    password: string;
    
    @IsOptional()
    @IsAlphanumeric()
    @MinLength(6)
    confirm_password: string;
}