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
