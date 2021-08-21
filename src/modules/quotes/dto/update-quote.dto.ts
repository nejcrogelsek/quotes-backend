import { User } from "../../../entities/user.entity";

export class UpdateQuoteDto {
    message: string;

    user: User;
}