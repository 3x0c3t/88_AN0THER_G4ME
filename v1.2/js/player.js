"use strict";


/* ============================================================
   JOUEURS
   ============================================================ */

export const PLAYERS = 8;

export const SECTOR_ANGLE =
    360 / PLAYERS;

export const CENTER_PLAYER = 0;


/* ============================================================
   COULEURS
   ============================================================ */

export const PLAYER_COLORS = {

    1: "#00e5ff",

    2: "#00ff99",

    3: "#ffe600",

    4: "#ff4057",

    5: "#ff8a00",

    6: "#ff3bd4",

    7: "#a855ff",

    8: "#3d8bff"

};


/* ============================================================
   ANGLE
   ============================================================ */

export function getAngleFromPosition(
    x,
    y
) {

    let angle =
        Math.atan2(
            y,
            x
        )
        *
        180
        /
        Math.PI;

    angle += 90;

    while (
        angle < 0
    ) {

        angle += 360;

    }

    while (
        angle >= 360
    ) {

        angle -= 360;

    }

    return angle;

}


/* ============================================================
   JOUEUR D'UNE POSITION
   ============================================================ */

export function getPlayerFromPosition(
    x,
    y
) {

    if (
        Math.max(
            Math.abs(x),
            Math.abs(y)
        ) <= 1
    ) {

        return CENTER_PLAYER;

    }

    const angle =
        getAngleFromPosition(
            x,
            y
        );

    const sector =
        Math.floor(
            angle /
            SECTOR_ANGLE
        );

    return sector + 1;

}