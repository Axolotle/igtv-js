import sunRiseSetFromRank from './sun-rank.js';
import {dayRank} from './utils.js';

function getSpaceTimeData() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(currentPos => {
            resolve({
                latitude: currentPos.coords.latitude,
                longitude: currentPos.coords.longitude,
                date: new Date(currentPos.timestamp)
            });
        });
        // TODO add default location and date on refusal
    });
}

export async function getSunData(method) {
    const {latitude, longitude, date} = await getSpaceTimeData();

    if (method === 'rank') {
        return sunRiseSetFromRank(longitude, latitude, dayRank(date));
    } else if (method === 'jd') {
        return sunRiseSetFromJulianDate(longitude, latitude, julianDate(date));
    }
}
