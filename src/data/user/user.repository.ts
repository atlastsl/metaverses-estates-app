// @ts-nocheck
import {AppHttpService} from "../../services/http/app.http.service.ts";
import {NavigateFunction} from "react-router";
import {AppHttpNetworkRepository} from "../../services/http/app.http.network.repository.ts";
import {
    LoginRequestDto,
    LoginResponseDto,
    TokenResponseDto,
    UserChangeUsernameRequestDto,
    UserPasswordResponseDto,
    UserRegisterUserRequestDto,
    UserResponseDto,
    UsersListResponseDto,
    UserUpdatePasswordRequestDto,
    UserUpdateRoleRequestDto,
    UserUpdateStatusRequestDto
} from "./user.dto.ts";
import {PaginationPayloadDto} from "../../services/http/http.dto.ts";
import axios from "axios";


export class UserRepository extends AppHttpNetworkRepository{

    constructor(navigate: NavigateFunction, cancelToken: axios.CancelToken) {
        super(navigate, cancelToken);
    }

    async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/auth/login',
                method: 'POST',
                publicRoute: true,
                bodyParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async refreshToken(): Promise<TokenResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/auth/token',
                method: 'GET',
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async myAccount(): Promise<UserResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users/my-account',
                method: 'GET',
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async changeMyUsername(payload: UserChangeUsernameRequestDto): Promise<UserResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users/my-account/username',
                method: 'PATCH',
                bodyParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async changeMyPassword(payload: UserUpdatePasswordRequestDto): Promise<UserResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users/my-account/password',
                method: 'PATCH',
                bodyParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async changeUsername(user_id: string, payload: UserUpdatePasswordRequestDto): Promise<UserResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users/:user_id/username',
                method: 'PATCH',
                pathParams: { user_id },
                bodyParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async resetPassword(user_id: string): Promise<UserPasswordResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users/:user_id/password',
                method: 'PATCH',
                pathParams: { user_id },
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async changeRole(user_id: string, payload: UserUpdateRoleRequestDto): Promise<UserResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users/:user_id/role',
                method: 'PATCH',
                pathParams: { user_id },
                bodyParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async changeStatus(user_id: string, payload: UserUpdateStatusRequestDto): Promise<UserResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users/:user_id/status',
                method: 'PATCH',
                pathParams: { user_id },
                bodyParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async registerUser(payload: UserRegisterUserRequestDto): Promise<UserPasswordResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users',
                method: 'POST',
                bodyParams: payload,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async listUsers(pagination: PaginationPayloadDto): Promise<UsersListResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users',
                method: 'GET',
                queryParams: pagination,
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }

    async getUser(user_id: string): Promise<UserResponseDto> {
        return await AppHttpService
            .getInstance()
            .request({
                endpoint: '/users/:user_id',
                method: 'GET',
                pathParams: { user_id },
                navigate: this.navigate,
                cancelToken: this.cancelToken,
            });
    }
}