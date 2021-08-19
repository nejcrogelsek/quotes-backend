import { IsAlphanumeric, IsNumber } from "class-validator";

export class UpdateQuoteDto {
    message: string;

    @IsNumber()
    user_id: number;
}