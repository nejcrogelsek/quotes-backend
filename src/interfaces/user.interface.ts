export interface IUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string;
    password: string;
    created_at: string;
    updated_at: string;
}
export type UserData = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string;
}