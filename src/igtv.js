import {getSunData} from './sun.js';
import {hourToString} from './utils.js'

async function geoTime() {
    let rank = await getSunData('rank');
    console.log(hourToString(rank.sunrise), hourToString(rank.sunset));
}

geoTime();
