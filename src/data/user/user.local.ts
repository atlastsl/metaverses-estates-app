import {LocalstorageService, LS_AUTH_TOKEN, LS_USER} from "../../services/localstorage/localstorage.service.ts";
import {User, UserRole} from "./user.dto.ts";

export class UserLocal {
    private static instance: UserLocal;

    static getInstance() {
        if (!this.instance) {
            this.instance = new UserLocal();
        }
        return this.instance;
    }

    constructor() {}

    getUser(): User | undefined {
        const jsonStr = LocalstorageService.getInstance().getItem<string>(LS_USER);
        return jsonStr ? (JSON.parse(jsonStr) as User) : undefined;
    }

    saveUser(user: User, authToken?: string): void {
        LocalstorageService.getInstance().setItem<string>(LS_USER, JSON.stringify(user));
        if (authToken) {
            LocalstorageService.getInstance().setItem<string>(LS_AUTH_TOKEN, authToken)
        }
    }

    getUsername(): string | undefined {
        const user = this.getUser();
        if (user) {
            return user.username;
        }
        return undefined;
    }

    getUserId(): string | undefined {
        const user = this.getUser();
        if (user) {
            return user.user_id;
        }
        return undefined;
    }

    getUserRole(): UserRole | undefined {
        const user = this.getUser();
        if (user) {
            return user.role;
        }
        return undefined;
    }

    isAdmin(): boolean {
        const user = this.getUser();
        if (user) {
            return user.role == UserRole.ADMIN;
        }
        return false;
    }
}