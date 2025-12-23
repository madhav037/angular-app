export interface User {
    id?: number;
    fullName: string;
    email: string;
    password: string;
    refreshToken?: string;
    refreshTokenExpiryTime?: Date;
}