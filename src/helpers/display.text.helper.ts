import i18n from "./intl/i18n.ts";


export interface IDisplayText {
    lang: string;
    value: string;
}

export class DisplayTextHelper {
    private static instance: DisplayTextHelper;

    static getInstance(): DisplayTextHelper {
        if (!DisplayTextHelper.instance) {
            DisplayTextHelper.instance = new DisplayTextHelper();
        }
        return DisplayTextHelper.instance;
    }

    constructor() {}

    getDisplayLang(): string {
        return i18n.language;
    }

    getDisplayTextFromDict(dict: IDisplayText[], defaultToken?: string) : string | undefined {
        let displayText = dict.find(x => x.lang === this.getDisplayLang())?.value;
        if (!displayText && defaultToken) {
            displayText = this.getDisplayTextFromApp(defaultToken as string);
        }
        return displayText;
    }

    getDisplayTextFromApp(token: string) : string {
        return i18n.t(token) || (token as string);
    }
}
