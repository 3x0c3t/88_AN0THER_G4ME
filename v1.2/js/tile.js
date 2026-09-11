"use strict";

import {
    CENTER_PLAYER,
    PLAYER_COLORS,
    getPlayerFromPosition
} from "./player.js";


/* ============================================================
   OBSTACLES
   ============================================================ */

export const OBSTACLES = [

    {
        player: 1,
        x: -2,
        y: -5
    },

    {
        player: 2,
        x: 2,
        y: -4
    },

    {
        player: 3,
        x: 5,
        y: -2
    },

    {
        player: 4,
        x: 4,
        y: 3
    },

    {
        player: 5,
        x: 2,
        y: 5
    },

    {
        player: 6,
        x: -2,
        y: 5
    },

    {
        player: 7,
        x: -5,
        y: 2
    },

    {
        player: 8,
        x: -4,
        y: -3
    }

];


/* ============================================================
   MONTAGNE
   ============================================================ */

export function isMountainTile(
    x,
    y
) {

    return (
        Math.max(
            Math.abs(x),
            Math.abs(y)
        ) <= 1
    );

}


/* ============================================================
   OBSTACLE
   ============================================================ */

export function getObstacle(
    x,
    y
) {

    return OBSTACLES.find(
        obstacle =>
            obstacle.x === x &&
            obstacle.y === y
    );

}


/* ============================================================
   CONFIGURATION CELLULE
   ============================================================ */

export function configureTile(
    tile,
    x,
    y,
    grid = "octagon",
    shape = "octagon"
) {

    tile.dataset.x =
        String(x);

    tile.dataset.y =
        String(y);

    tile.dataset.grid =
        grid;

    tile.dataset.shape =
        shape;

    tile.style.setProperty(
        "--x",
        String(x)
    );

    tile.style.setProperty(
        "--y",
        String(y)
    );

}


/* ============================================================
   CREATION OCTOGONE
   ============================================================ */

export function createOctagonTile(
    x,
    y
) {

    const tile =
        document.createElement(
            "div"
        );

    tile.className =
        "tile";

    configureTile(
        tile,
        x,
        y,
        "octagon",
        "octagon"
    );


    if (
        isMountainTile(
            x,
            y
        )
    ) {

        tile.classList.add(
            "mountain-tile"
        );

        tile.dataset.player =
            String(
                CENTER_PLAYER
            );

        tile.dataset.mountain =
            "true";

        if (
            x === 0 &&
            y === 0
        ) {

            tile.classList.add(
                "mountain-center"
            );

            tile.innerHTML = `
                <span class="mountain-mark">
                    ◆
                </span>
            `;

        }

        else {

            tile.innerHTML = `
                <span class="mountain-mark">
                    ◇
                </span>
            `;

        }

    }

    else {

        const player =
            getPlayerFromPosition(
                x,
                y
            );

        tile.dataset.player =
            String(
                player
            );

        tile.classList.add(
            `player-${player}`
        );

        tile.style.setProperty(
            "--player-color",
            PLAYER_COLORS[player]
        );

        tile.innerHTML = `
            <span class="tile-number">
                ${player}
            </span>
        `;

    }


    const obstacle =
        getObstacle(
            x,
            y
        );

    if (
        obstacle
    ) {

        tile.classList.add(
            "obstacle"
        );

        tile.dataset.obstacle =
            "true";

        tile.innerHTML = `
            <span class="obstacle-mark">
                ×
            </span>
        `;

    }


    return tile;

}


/* ============================================================
   CREATION CARRE
   ============================================================ */

export function createSquareTile(
    x,
    y
) {

    const tile =
        document.createElement(
            "div"
        );

    tile.className =
        "tile square-tile";

    configureTile(
        tile,
        x,
        y,
        "square",
        "square"
    );

    tile.dataset.player =
        "0";

    tile.dataset.content =
        "EMPTY SQUARE";

    tile.innerHTML = `
        <span class="square-mark">
        </span>
    `;

    return tile;

}