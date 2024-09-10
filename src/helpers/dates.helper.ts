

export class DatesHelper {
    static instance: DatesHelper;

    constructor() {}

    public static getInstance() {
        if (!DatesHelper.instance) {
            DatesHelper.instance = new DatesHelper();
        }
        return DatesHelper.instance;
    }

    private normalizeDate(date: Date | string | number) : Date {
        return typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    }

    private printDate (_date: Date | string | number): string {
        const date = this.normalizeDate(_date);
        let day: number | string = date.getUTCDate(), month: number | string = date.getUTCMonth()+1, year: number | string = date.getUTCFullYear();
        day = day.toString(10).padStart(2, "0");
        month = month.toString(10).padStart(2, "0");
        return day + "/" + month + "/" + year;
    }

    private printTime (_date: Date | string | number, sec: boolean = false, ms: boolean = false): string {
        const date = this.normalizeDate(_date);
        let hours: number | string = date.getUTCHours(), minutes: number | string = date.getUTCMinutes(),
            seconds: number | string = date.getUTCSeconds(), millis: number | string = date.getUTCMilliseconds();
        hours = hours.toString(10).padStart(2, "0");
        minutes = minutes.toString(10).padStart(2, "0");
        seconds = seconds.toString(10).padStart(2, "0");
        millis = millis.toString(10).padStart(2, "0");
        if (sec && ms) return hours + ":" + minutes + ":" + seconds + ":" + millis;
        else if (sec) return hours + ":" + minutes + ":" + seconds;
        else return hours + ":" + minutes;
    }

    printDateAndTime (date: Date | string | number): string {
        return this.printDate(date) + " " + this.printTime(date);
    }
}
