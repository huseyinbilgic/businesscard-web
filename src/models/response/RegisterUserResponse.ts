import { Role } from "../enums/Role";

export interface RegisterUserResponse {
    id: number;
    email: string;
    username: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}