export function dayRank(date) {
    let {year, month, day} = date instanceof Date ? {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    } : date;

    const N1 = Math.trunc(month * 275 / 9);
    const N2 = Math.trunc((month + 9) / 12);
    // K = 2 for common year and 1 when leap year
    const K = Math.trunc(1 + (year - 4 * Math.trunc(year / 4) + 2) / 3);
    return N1 - N2 * K + day - 30;
}

export function hourToString(decimalHour) {
    let date = new Date(0,0);
    date.setSeconds(decimalHour * 60 * 60);
    return date.toTimeString().slice(0, 8);
}

export function deg_to_rad(deg) {
    return deg * (Math.PI / 180);
}

export function rad_to_deg(rad) {
    return rad * (180 / Math.PI);
}
