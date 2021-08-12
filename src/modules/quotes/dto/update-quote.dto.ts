import { IsAlphanumeric, IsNumber } from "class-validator";

export class UpdateQuoteDto {
    @IsAlphanumeric()
    message: string;

    @IsNumber()
    user_id: number;
}