
import { IsAlphanumeric } from "class-validator";

export class UpdateQuoteDto{
    @IsAlphanumeric()
    message: string;
}