export default class ExtraDate extends Date {
    constructor(value) {
        super(value);

        this.EPOCH = 2451545;
    }

    /**
     * Returns the Julian Day corresponding to this date (UTC).
     * @returns {number} Julian Day (JD) as a floating point (with hours)
     */
    toJulianDayJS() {
        // this.getTime() returns the number of milliseconds since JS Date Epoch
        // (January 1, 1970, 00:00:00 UTC), so dividing it by the number of
        // milliseconds in a day (86400000 = 24 * 60 * 60 * 1000) will give the
        // floating point number of days since this epoch.
        let DaysSinceJSEpoch = this.getTime() / 86400000;
        // Since the date may not be UTC, substract the offset divided by the
        // number of minutes in a day (1440 = 24 * 60)
        DaysSinceJSEpoch -= this.getTimezoneOffset() / 1440;

        // Adds the number of days from Julian Epoch to JS Epoch
        return DaysSinceJSEpoch + 2440587.5;
    }

    /**
     * Returns the Julian Day corresponding to this date (UTC).
     * Gregorian or Julian calendar date can be given.
     * Based on J. Meeus *Astronomical Algorithms*, chapter 7.
     * @param {boolean} [midnight=false] - true if julian day is needed at 00h00 UTC (ending on .5)
     * @param {boolean} [gregorian=true] - true if date is in Gregorian, false if in Julian
     * @returns {number} julian day (JD) as a floating point (with hours)
     */
    toJulianDay(midnight=false, gregorian=true) {
        let year = this.getUTCFullYear();
        let month = this.getUTCMonth() + 1;
        let day = this.getUTCDate();
        if (!midnight) day += this.getDecimalHour() / 24;
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

    /**
     * Returns the number of Julian centuries since Jan 1, 2000, 0 UTC.
     * Based on J. Meeus *Astronomical Algorithms*, chapter 11.1.
     * @param {boolean} [midnight=false] - true if julian day is needed at 00h00 UTC (ending on .5)
     * @returns {number} julian centuries (T)
     */
    toJulianCenturies(midnight=false) {
        return (this.toJulianDay(midnight) - this.EPOCH) / 36525;
    }

    /**
     * Returns the time as decimal hours.
     * @returns {number} floating point number
     */
    getDecimalHour() {
        let hours = this.getUTCHours();
        let minutes = this.getUTCMinutes();
        let seconds = this.getUTCSeconds();

        return hours + (minutes / 60) + (seconds / 3600);
    }

    /**
     * Returns the number of the day in the year.
     * @returns {number} floating point number
     */
    getRankInYear() {
        const year = this.getUTCFullYear();
        const month = this.getUTCMonth() + 1;
        const day = this.getUTCDate();

        const N1 = Math.trunc(month * 275 / 9);
        const N2 = Math.trunc((month + 9) / 12);
        // K = 2 for common year and 1 when leap year
        const K = Math.trunc(1 + (year - 4 * Math.trunc(year / 4) + 2) / 3);

        return N1 - N2 * K + day - 30;
    }

    /**
     * Returns the **mean** sidereal angle at Greenwich (theta0) at 00h00 UTC for this date.
     * This is the Greenwich hour angle of the **mean** vernal point (the intersection
     * of the ecliptic of the date with the mean celestial equator of the date).
     * Based on J. Meeus *Astronomical Algorithms*, chapter 11.3.
     * @param {number} [T=this.toJulianCenturies()] - Julian centuries since EPOCH
     * @returns {number} mean sidereal time in degrees
     */
    getMeanSiderealAngle(T = this.toJulianCenturies(true)) {
        let siderealAngle = (
            100.46061837
            + 36000.770053608 * T
            + 0.000387933 * T * T
            - (T * T * T) / 38710000
        ) % 360;

        return siderealAngle < 0 ? siderealAngle + 360 : siderealAngle;
    }

    /**
     * Higher precision than getMeanSiderealTime().
     * Based on J. Meeus *Astronomical Algorithms*, chapter 11.4.
     * @param {number} [JD=this.toJulianDay()] - Julian Day
     * @param {number} [T=this.toJulianCenturies()] - Julian centuries since EPOCH
     * @returns {number} mean sidereal time in degrees
     */
    getHPMeanSiderealAngle(JD = this.toJulianDay(), T = this.toJulianCenturies(true)) {
        let siderealAngle = (
            280.46061837
            + 360.98564736629 * (JD - this.EPOCH)
            + 0.000387933 * T * T
            - (T * T * T) / 38710000
        ) % 360;

        return siderealAngle < 0 ? siderealAngle + 360 : siderealAngle;
    }

    /**
     * Returns a extraDate object from a julian day.
     * Only works for positive julian day.
     * @returns {Object} julian centuries (T)
     */
    static fromJulianDay(JD) {
        JD += 0.5;
        let Z = Math.trunc(JD);
        let F = JD - Z;
        let A;
        if (Z < 2299161) {
            A = Z;
        } else {
            let a = Math.trunc((Z - 1867216.25) / 36524.25);
            A = Z + 1 + a - Math.trunc(a / 4);
        }

        const B = A + 1524;
        const C = Math.trunc((B - 122.1) / 365.25);
        const D = Math.trunc(C * 365.25);
        const E = Math.trunc((B - D) / 30.6001);

        let dayFraction = B - D - Math.trunc(E * 30.6001) + F;
        const day = Math.trunc(dayFraction);
        const month = E < 14 ? E - 1 : E - 13;
        const year = month > 2 ? C - 4716 : C - 4715;
        const seconds = (dayFraction - day) * 86400;

        return new ExtraDate(Date.UTC(year, month - 1, day, 0, 0, seconds));
    }
}
