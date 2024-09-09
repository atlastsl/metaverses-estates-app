import {PaginationResponseDto} from "../../services/http/http.dto.ts";

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum UserStatus {
    SUSPENDED = 'SUSPENDED',
    ACTIVE = 'ACTIVE',
}

export interface User {
    _id: string;
    user_id: string;
    username: string;
    role: UserRole;
    status: UserStatus;
    created_at: Date;
    updated_at: Date;
    deleted?: boolean;
}

export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface UserChangeUsernameRequestDto {
    new_username: string;
}

export interface UserUpdateRoleRequestDto {
    role: UserRole;
}

export interface UserUpdateStatusRequestDto {
    status: UserStatus;
}

export interface UserUpdatePasswordRequestDto {
    old_password: string;
    new_password: string;
}

export interface UserRegisterUserRequestDto {
    username: string;
    role: UserRole;
    password?: string;
}

export interface LoginResponseDto {
    user: User;
    access_token: string;
}

export interface TokenResponseDto {
    access_token: string;
}

export interface UserResponseDto {
    user: User;
}

export interface UserPasswordResponseDto {
    user?: User;
    password: string;
}

export interface UsersListResponseDto {
    pagination: PaginationResponseDto;
    users: User[]
}