import { IsNumber } from "class-validator";

export class CreateRemoveVoteDto {
    @IsNumber()
    quote_id: number;

    @IsNumber()
    user_id: number;
}