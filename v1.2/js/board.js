"use strict";

import {
    createOctagonTile,
    createSquareTile
} from "./tile.js";


/* ============================================================
   CONFIGURATION
   ============================================================ */

export const GRID_RADIUS = 7;


/* ============================================================
   ETAT
   ============================================================ */

let board = null;

let tiles = [];

let octagonTiles = [];

let squareTiles = [];


/* ============================================================
   DOM
   ============================================================ */

function getBoard() {

    if (
        !board
    ) {

        board =
            document.getElementById(
                "board"
            );

    }

    return board;

}


/* ============================================================
   DISTANCE
   ============================================================ */

export function distanceFromCenter(
    x,
    y
) {

    return Math.sqrt(
        x * x +
        y * y
    );

}


/* ============================================================
   PLATEAU
   ============================================================ */

export function isInsideBoard(
    x,
    y
) {

    return (
        distanceFromCenter(
            x,
            y
        )
        <=
        GRID_RADIUS + 0.35
    );

}


/* ============================================================
   CREATION
   ============================================================ */

export function createBoard() {

    const container =
        getBoard();

    if (
        !container
    ) {

        return;

    }

    container.innerHTML =
        "";

    tiles = [];

    octagonTiles = [];

    squareTiles = [];


    /* ========================================================
       OCTOGONES
       ======================================================== */

    for (
        let y = -GRID_RADIUS;
        y <= GRID_RADIUS;
        y++
    ) {

        for (
            let x = -GRID_RADIUS;
            x <= GRID_RADIUS;
            x++
        ) {

            if (
                !isInsideBoard(
                    x,
                    y
                )
            ) {

                continue;

            }

            const tile =
                createOctagonTile(
                    x,
                    y
                );

            container.appendChild(
                tile
            );

            tiles.push(
                tile
            );

            octagonTiles.push(
                tile
            );

        }

    }


    /* ========================================================
       CARRES
       ======================================================== */

    for (
        let y = -GRID_RADIUS;
        y < GRID_RADIUS;
        y++
    ) {

        for (
            let x = -GRID_RADIUS;
            x < GRID_RADIUS;
            x++
        ) {

            const squareX =
                x + 0.5;

            const squareY =
                y + 0.5;

            if (
                !isInsideBoard(
                    squareX,
                    squareY
                )
            ) {

                continue;

            }

            const tile =
                createSquareTile(
                    squareX,
                    squareY
                );

            container.appendChild(
                tile
            );

            tiles.push(
                tile
            );

            squareTiles.push(
                tile
            );

        }

    }


    console.log(
        `BOARD → ${octagonTiles.length} octagons · ${squareTiles.length} squares`
    );

}


/* ============================================================
   ACCES
   ============================================================ */

export function getTiles() {

    return tiles;

}


export function getOctagonTiles() {

    return octagonTiles;

}


export function getSquareTiles() {

    return squareTiles;

}


/* ============================================================
   RECHERCHE CELLULE
   ============================================================ */

export function findTile(
    data
) {

    if (
        !data
    ) {

        return null;

    }

    const grid =
        data.grid ||
        "octagon";

    const x =
        Number(
            data.x
        );

    const y =
        Number(
            data.y
        );

    return tiles.find(
        tile =>
            tile.dataset.grid ===
                grid
            &&
            Number(
                tile.dataset.x
            ) === x
            &&
            Number(
                tile.dataset.y
            ) === y
    ) || null;

}