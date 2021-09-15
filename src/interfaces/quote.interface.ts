import { UserData } from "./user.interface";
import { VoteData } from "./vote.interface";

export interface QuoteData {
    id: number;
    message: string;
    votes: VoteData[];
    user: UserData;
    created_at: string;
    updated_at: string;
}

export interface IMostLikedQuote {
    id: number;
    message: string;
    user: UserData;
    votes: number;
}

export interface IQuotes {
    quotes: QuoteData[];
}