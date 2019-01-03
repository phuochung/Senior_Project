import * as moment from 'moment';
export class DateTimeHelper {
    public static getWeekNumber() {
        // Copy date so don't modify original
        let d: any = new Date();
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return weekNo;
    }

    public static getFirstDayOfISOWeek(w, y) {
        var simple = new Date(y, 0, 1 + (w - 1) * 7);
        var dow = simple.getDay();
        var ISOweekStart = simple;
        if (dow <= 4)
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        return ISOweekStart;
    }

    public static getLastDayOfISOWeek(w, y) {
        var firstDay = this.getFirstDayOfISOWeek(w, y);
        var lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 6);
        return lastDay;
    }

    public static getWeeksOfYear(y) {
        var maxWeek = 52;
        var currentYear = (new Date()).getFullYear();
        if (y == currentYear) maxWeek = this.getWeekNumber();
        var weeks = [];
        for (var i = 1; i <= maxWeek; i++) {
            weeks.push(i);
        }
        return weeks;
    }

    public static getMonday() {
        let d = new Date();
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    public static getTimeStampFromDateTimeFormat(date, format) {
        return moment(date, format).unix();
    }

    public static getTimeStampToday(date, format) {
        return moment(date, format).unix();
    }
}