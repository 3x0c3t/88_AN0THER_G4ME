"use strict";

import {
    wasDragged
} from "./rotation.js";


/* ============================================================
   ETAT
   ============================================================ */

let selectedTile = null;

let callbacks = {};


/* ============================================================
   SELECTION
   ============================================================ */

export function selectTile(
    tile
) {

    if (
        selectedTile
    ) {

        selectedTile.classList.remove(
            "selected"
        );

    }

    selectedTile =
        tile;

    if (
        selectedTile
    ) {

        selectedTile.classList.add(
            "selected"
        );

        updateInspector(
            selectedTile
        );

    }

    else {

        clearInspector();

    }

}


/* ============================================================
   ACCES
   ============================================================ */

export function getSelectedTile() {

    return selectedTile;

}


export function clearSelection() {

    selectTile(
        null
    );

}


/* ============================================================
   INSPECTEUR
   ============================================================ */

function updateInspector(
    tile
) {

    const grid =
        document.getElementById(
            "cellGrid"
        );

    const shape =
        document.getElementById(
            "cellShape"
        );

    const x =
        document.getElementById(
            "cellX"
        );

    const y =
        document.getElementById(
            "cellY"
        );

    const player =
        document.getElementById(
            "cellPlayer"
        );

    const content =
        document.getElementById(
            "cellContent"
        );

    const preview =
        document.getElementById(
            "cellPreview"
        );

    const inspector =
        document.getElementById(
            "cellInspector"
        );

    if (
        !inspector
    ) {

        return;

    }

    inspector.classList.add(
        "visible"
    );

    if (
        grid
    ) {

        grid.textContent =
            tile.dataset.grid ||
            "—";

    }

    if (
        shape
    ) {

        shape.textContent =
            tile.dataset.shape ||
            "—";

    }

    if (
        x
    ) {

        x.textContent =
            formatCoordinate(
                tile.dataset.x
            );

    }

    if (
        y
    ) {

        y.textContent =
            formatCoordinate(
                tile.dataset.y
            );

    }

    if (
        player
    ) {

        player.textContent =
            tile.dataset.player ||
            "—";

    }

    if (
        content
    ) {

        content.textContent =
            getTileContent(
                tile
            );

    }

    if (
        preview
    ) {

        preview.className =
            "cell-preview";

        if (
            tile.dataset.shape ===
            "square"
        ) {

            preview.classList.add(
                "preview-square"
            );

            preview.textContent =
                "";

        }

        else if (
            tile.dataset.mountain ===
            "true"
        ) {

            preview.classList.add(
                "preview-mountain"
            );

            preview.textContent =
                tile.classList.contains(
                    "mountain-center"
                )
                    ? "◆"
                    : "◇";

        }

        else if (
            tile.dataset.obstacle ===
            "true"
        ) {

            preview.classList.add(
                "preview-obstacle"
            );

            preview.textContent =
                "×";

        }

        else {

            preview.classList.add(
                "preview-octagon"
            );

            preview.textContent =
                tile.dataset.player ||
                "?";

        }

    }

}


/* ============================================================
   CONTENU
   ============================================================ */

function getTileContent(
    tile
) {

    if (
        tile.dataset.shape ===
        "square"
    ) {

        return "EMPTY SQUARE";

    }

    if (
        tile.dataset.mountain ===
        "true"
    ) {

        if (
            tile.classList.contains(
                "mountain-center"
            )
        ) {

            return "MOUNTAIN CENTER";

        }

        return "MOUNTAIN";

    }

    if (
        tile.dataset.obstacle ===
        "true"
    ) {

        return "OBSTACLE";

    }

    const player =
        tile.dataset.player;

    if (
        player &&
        player !== "0"
    ) {

        return `TERRITORY P${player}`;

    }

    return "EMPTY";

}


/* ============================================================
   COORDONNEES
   ============================================================ */

function formatCoordinate(
    value
) {

    const number =
        Number(
            value
        );

    if (
        Number.isInteger(
            number
        )
    ) {

        return String(
            number
        );

    }

    return number.toFixed(
        1
    );

}


/* ============================================================
   CLICK CELLULE
   ============================================================ */

function handleTileClick(
    event
) {

    if (
        wasDragged()
    ) {

        return;

    }

    const tile =
        event.currentTarget;

    const x =
        Number(
            tile.dataset.x
        );

    const y =
        Number(
            tile.dataset.y
        );

    const grid =
        tile.dataset.grid;

    const player =
        Number(
            tile.dataset.player
        );

    if (
        callbacks.onCoordinates
    ) {

        callbacks.onCoordinates(
            x,
            y
        );

    }


    /* ========================================================
       MONTAGNE
       ======================================================== */

    if (
        tile.dataset.mountain ===
        "true"
    ) {

        selectTile(
            tile
        );

        callbacks.onAction?.(
            `MOUNTAIN · X${x} · Y${y}`
        );

        callbacks.onNotification?.(
            "CENTRAL MOUNTAIN"
        );

        return;

    }


    /* ========================================================
       OBSTACLE
       ======================================================== */

    if (
        tile.dataset.obstacle ===
        "true"
    ) {

        selectTile(
            tile
        );

        callbacks.onAction?.(
            `OBSTACLE · X${x} · Y${y}`
        );

        callbacks.onNotification?.(
            "TILE BLOCKED"
        );

        return;

    }


    /* ========================================================
       CARRE
       ======================================================== */

    if (
        grid ===
        "square"
    ) {

        selectTile(
            tile
        );

        callbacks.onAction?.(
            `SQUARE · X${x} · Y${y}`
        );

        callbacks.onNotification?.(
            "SQUARE SELECTED"
        );

        return;

    }


    /* ========================================================
       OCTOGONE
       ======================================================== */

    selectTile(
        tile
    );

    callbacks.onScore?.();

    callbacks.onAction?.(
        `P${player} · X${x} · Y${y}`
    );

    callbacks.onNotification?.(
        `PLAYER ${player} SELECTED`
    );

}


/* ============================================================
   HOVER
   ============================================================ */

function handleTileEnter(
    event
) {

    const tile =
        event.currentTarget;

    const x =
        Number(
            tile.dataset.x
        );

    const y =
        Number(
            tile.dataset.y
        );

    if (
        callbacks.onCoordinates
    ) {

        callbacks.onCoordinates(
            x,
            y
        );

    }

    if (
        tile.dataset.mountain ===
        "true"
    ) {

        callbacks.onAction?.(
            `MOUNTAIN · X${x} · Y${y}`
        );

        return;

    }

    if (
        tile.dataset.obstacle ===
        "true"
    ) {

        callbacks.onAction?.(
            `OBSTACLE · X${x} · Y${y}`
        );

        return;

    }

    if (
        tile.dataset.grid ===
        "square"
    ) {

        callbacks.onAction?.(
            `SQUARE · X${x} · Y${y}`
        );

        return;

    }

    const player =
        tile.dataset.player;

    callbacks.onAction?.(
        `PLAYER ${player} · X${x} · Y${y}`
    );

}


/* ============================================================
   INITIALISATION
   ============================================================ */

export function initInteraction(
    options = {}
) {

    callbacks =
        options;

    const board =
        document.getElementById(
            "board"
        );

    if (
        !board
    ) {

        return;

    }


    board.addEventListener(
        "click",
        event => {

            const tile =
                event.target.closest(
                    ".tile"
                );

            if (
                !tile ||
                !board.contains(
                    tile
                )
            ) {

                return;

            }

            handleTileClick({
                currentTarget:
                    tile
            });

        }
    );


    board.addEventListener(
        "mouseover",
        event => {

            const tile =
                event.target.closest(
                    ".tile"
                );

            if (
                !tile
            ) {

                return;

            }

            handleTileEnter({
                currentTarget:
                    tile
            });

        }
    );


    board.addEventListener(
        "mouseleave",
        () => {

            if (
                selectedTile
            ) {

                callbacks.onAction?.(
                    "SELECTED TILE"
                );

            }

            else {

                callbacks.onAction?.(
                    "SELECT A TILE"
                );

            }

        }
    );

}


/* ============================================================
   INSPECTEUR RESET
   ============================================================ */

function clearInspector() {

    const inspector =
        document.getElementById(
            "cellInspector"
        );

    if (
        !inspector
    ) {

        return;

    }

    inspector.classList.remove(
        "visible"
    );

}