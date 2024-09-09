
export class StringsHelper {
    private static instance: StringsHelper;

    static getInstance(): StringsHelper {
        if (!StringsHelper.instance) {
            StringsHelper.instance = new StringsHelper();
        }
        return StringsHelper.instance;
    }

    constructor() {}

    private escapeRegExp(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    replaceAll(str: string, match: string, replacement: string): string {
        return str.replace(
            new RegExp(this.escapeRegExp(match), 'g'),
            () => this.trimToEmpty(replacement),
        );
    }

    replaceAllArray(str: string, match: string[], replacement: string[]): string {
        let _str = str;
        for (let i = 0; i < match.length; i++) {
            _str = _str.replace(
                new RegExp(this.escapeRegExp(match[i]), 'g'),
                () => this.trimToEmpty(replacement[i] || ''),
            );
        }
        return _str
    }

    isStringEmpty(str: string): boolean {
        return this.trimToEmpty(str) === "";
    }

    trimToEmpty(_str: string): string {
        let str = _str;
        if (str == null) str = '';
        while (
            str.endsWith(' ') ||
            str.endsWith('\n') ||
            str.endsWith('\r') ||
            str.endsWith('\t')
            ) {
            str = str.substring(0, str.length - 1);
        }
        while (
            str.startsWith(' ') ||
            str.startsWith('\n') ||
            str.startsWith('\r') ||
            str.startsWith('\t')
            ) {
            str = str.substring(1);
        }
        return str;
    }

    trimToNull(str: string): string | null {
        const trimmed = this.trimToEmpty(str);
        return trimmed === "" ? null : trimmed;
    }

    normalizeNFD(str: string): string {
        return str == null
            ? ''
            : str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}
