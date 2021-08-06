import { IsAlphanumeric, IsNumber } from "class-validator";

export class CreateQuoteDto{
    @IsAlphanumeric()
    message: string;

    @IsNumber()
    user_id: number;
}