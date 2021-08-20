import { IsNumber } from "class-validator";

export class RemoveVoteDto {
    @IsNumber()
    quote_id: number;

    @IsNumber()
    user_id: number;
}