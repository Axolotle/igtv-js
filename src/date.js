export default class ExtraDate extends Date {
    constructor(value, utc=false) {
        super(value);
        this.isUTC = utc;
    }

    /**
     * Returns the time as decimal hours.
     * @returns {number} floating point number
     */
    getDecimalHour() {
        let hours = this.isUTC ? this.getUTCHours() : this.getHours();
        let minutes = this.isUTC ? this.getUTCMinutes() : this.getMinutes();
        let seconds = this.isUTC ? this.getUTCSeconds() : this.getSeconds();

        return hours + (minutes / 60) + (seconds / 3600);
    }

    /**
     * Returns the number of the day in the year.
     * @returns {number} floating point number
     */
    toRankInYear() {
        const year = this.isUTC ? date.getUTCFullYear() : this.getFullYear();
        const month = this.isUTC ? this.getUTCMonth() + 1 : this.getMonth() + 1;
        const day = this.isUTC ? this.getUTCDate() : this.getDate();

        const N1 = Math.trunc(month * 275 / 9);
        const N2 = Math.trunc((month + 9) / 12);
        // K = 2 for common year and 1 when leap year
        const K = Math.trunc(1 + (year - 4 * Math.trunc(year / 4) + 2) / 3);

        return N1 - N2 * K + day - 30;
    }

    /**
     * Returns the Julian Day corresponding to this date.
     * @returns {number} Julian Day (JD) as a floating point (with hours)
     */
    toJulianDayJS() {
        // this.getTime() returns the number of milliseconds since JS Date Epoch
        // (January 1, 1970, 00:00:00 UTC), so dividing it by the number of
        // milliseconds in a day (86400000 = 24 * 60 * 60 * 1000) will give the
        // floating point number of days since this epoch.
        let DaysSinceJSEpoch = this.getTime() / 86400000;
        // if date is not UTC, substract the offset divided by the number of
        // minutes in a day (1440 = 24 * 60)
        if (!this.isUTC) DaysSinceJSEpoch -= this.getTimezoneOffset() / 1440;

        // Adds the number of days from Julian Epoch to JS Epoch
        return DaysSinceJSEpoch + 2440587.5;
    }

    /**
     * Returns the Julian Day corresponding to this date.
     * Gregorian or Julian calendar date can be given.
     * Based on J. Meeus *Astronomical Algorithms*, chapter 7
     * @param {boolean} [gregorian=true] - true if date is in Gregorian, false if in Julian
     * @returns {number} julian day (JD) as a floating point (with hours)
     */
    toJulianDay(gregorian=true) {
        let year = this.getFullYear();
        let month = this.getMonth() + 1;
        let day = this.getDate() + this.getDecimalHour() / 24;
        if (month <= 2) {
            year += -1;
            month += 12;
        }
        const A = Math.trunc(year / 100);
        const B = gregorian ? 2 - A + Math.trunc(A / 4) : 0;

        return Math.trunc(365.25 * (year + 4716))
               + Math.trunc(30.6001 * (month + 1))
               + day + B - 1524.5;
    }
}
