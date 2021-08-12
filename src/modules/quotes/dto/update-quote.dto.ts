
import { IsAlphanumeric, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateQuoteDto {
    @IsOptional()
    message: string;

    @IsOptional()
    @IsNumber()
    votes: number;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}