export function hourToString(decimalHour) {
    let date = new Date(Date.UTC(0,0));
    date.setSeconds(decimalHour * 60 * 60);
    return date.toTimeString().slice(0, 8);
}

export function degToHourString(deg) {
    return hourToString(deg / 15);
}

export function degToRad(deg) {
    return deg * (Math.PI / 180);
}

export function radToDeg(rad) {
    return rad * (180 / Math.PI);
}

export function minToDeg(min) {
    return min / 60;
}

export function degToHour(deg) {
    // deg / (360 / 24)
    return deg / 15;
}
