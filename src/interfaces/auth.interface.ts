export interface AuthReturnData {
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        profile_image: string;
    },
    access_token: string;
}

export interface UserDataFromToken {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string;
}
export interface RefreshTokenData { name: string, sub: number }