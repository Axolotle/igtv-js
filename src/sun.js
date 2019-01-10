import ExtraDate from './date.js';
import sunRiseSetFromRank from './sun-rank.js';

function getSpaceTimeData() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(currentPos => {
            resolve({
                latitude: currentPos.coords.latitude,
                longitude: currentPos.coords.longitude,
                date: new ExtraDate(currentPos.timestamp)
            });
        });
        // TODO add default location and date on refusal
    });
}

export async function getSunData(method) {
    const {latitude, longitude, date} = await getSpaceTimeData();
    if (method === 'rank') {
        return sunRiseSetFromRank(longitude, latitude, date);
    }
}
