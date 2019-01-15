import {degToRad} from './utils.js';

function sunVariables(rank) {
    // anomalie moyenne en rad
    const M = degToRad(356.8 + (360 / 365.2425) * (rank - 1));
    // équation du centre (influence de l'ellipticité de l'orbite terrestre) en deg
    const C = 1.91378 * Math.sin(M) + 0.02 * Math.sin(2 * M)
    // longitude vraie du Soleil en rad
    const L = degToRad(280 + C + (360 / 365.2425) * rank);
    // réduction à l'équateur (influence de l'inclinaison de l'axe terrestre) en deg
    const R = -2.46522 * Math.sin(2 * L) + 0.05303 * Math.sin(4 * L);

    return {
        // equation du temps en min
        EOT: (C + R) * 4,
        // déclinaison solaire en rad
        SDEC: Math.asin(0.39774 * Math.sin(L))
    }
}

export default function sunRiseSetFromRank(longitude, latitude, date) {
    const {EOT, SDEC} = sunVariables(date.getRankInYear());

    // angle horaire du Soleil en rad
    const H0 = Math.acos(
        (-0.01454 - Math.sin(SDEC) * Math.sin(degToRad(latitude)))
        / (Math.cos(SDEC) * Math.cos(degToRad(latitude)))
    ) / degToRad(15);

    return {
        sunrise: 12 - H0 + EOT / 60 + longitude / 15,
        sunset: 12 + H0 + EOT / 60 + longitude / 15
    }
}
