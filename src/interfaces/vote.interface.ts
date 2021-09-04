import { UserData } from "./user.interface"

export interface VoteData {
    id: number;
    quote_id: number;
    user: UserData;
}
export interface IVotes {
    quote: VoteData[];
}