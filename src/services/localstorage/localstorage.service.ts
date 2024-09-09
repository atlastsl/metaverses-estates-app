import SecureLS from "secure-ls";

export class LocalstorageService {
    private static instance: LocalstorageService;

    static getInstance() {
        if (!LocalstorageService.instance) {
            LocalstorageService.instance = new LocalstorageService(new SecureLS());
        }
        return this.instance;
    }

    constructor(private readonly ls: SecureLS) {
    }

    setItem<T>(token: string, item: T): void {
        this.ls.set(token, item);
    }

    getItem<T>(token: string): T | null | undefined {
        const item = this.ls.get(token);
        return item ? item as T : null;
    }

    removeItem(token: string): void {
        this.ls.remove(token);
    }

    clearStorage(): void {
        this.ls.clear();
    }
}

export const LS_AUTH_TOKEN = 'AUTH_TOKEN';

export const LS_USER = 'USER';

export const LS_ASSETS_FILTERS = 'ASSETS_FILTERS';
