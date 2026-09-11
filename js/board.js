import {
    GRID_RADIUS,
    PLAYERS,
    SECTOR_ANGLE,
    MOUNTAIN_RADIUS
} from "./config.js";

import { state } from "./state.js";

import { dom } from "./dom.js";

import {
    updateCoordinates
} from "./ui.js";


export function createBoard() {

    dom.board.innerHTML = "";

    state.cells = [];

    state.octoCells = [];

    state.squareCells = [];


    createOctagonalGrid();

    createSquareGrid();

    renderCells();

}


function createOctagonalGrid() {

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

            const distance =
                Math.sqrt(
                    x * x +
                    y * y
                );

            if (distance > GRID_RADIUS) {
                continue;
            }


            const cell = {

                id:
                    `octo_${x}_${y}`,

                type:
                    "octagon",

                grid:
                    "octogonal",

                x,

                y,

                owner:
                    getSectorPlayer(x, y),

                selected:
                    false,

                obstacle:
                    Math.max(
                        Math.abs(x),
                        Math.abs(y)
                    ) <= MOUNTAIN_RADIUS

            };


            state.octoCells.push(cell);

            state.cells.push(cell);

        }

    }

}


function createSquareGrid() {

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

            const cx =
                x + 0.5;

            const cy =
                y + 0.5;


            const distance =
                Math.sqrt(
                    cx * cx +
                    cy * cy
                );

            if (distance > GRID_RADIUS - 0.25) {
                continue;
            }


            const cell = {

                id:
                    `square_${x}_${y}`,

                type:
                    "square",

                grid:
                    "square",

                x: cx,

                y: cy,

                owner:
                    getSectorPlayer(cx, cy),

                selected:
                    false,

                obstacle:
                    false

            };


            state.squareCells.push(cell);

            state.cells.push(cell);

        }

    }

}


function getSectorPlayer(x, y) {

    if (x === 0 && y === 0) {
        return CENTER_PLAYER;
    }


    let angle =
        Math.atan2(
            -y,
            x
        ) *
        180 /
        Math.PI;


    angle += 360;

    angle %= 360;


    angle += 22.5;

    angle %= 360;


    return (
        Math.floor(
            angle /
            SECTOR_ANGLE
        ) + 1
    );

}


function renderCells() {

    const fragment =
        document.createDocumentFragment();


    for (const cell of state.cells) {

        const element =
            document.createElement("button");


        element.type =
            "button";


        element.className =
            `cell ${cell.type} player-${cell.owner}`;


        element.dataset.id =
            cell.id;


        element.dataset.type =
            cell.type;


        element.dataset.x =
            cell.x;


        element.dataset.y =
            cell.y;


        element.style.setProperty(
            "--x",
            cell.x
        );


        element.style.setProperty(
            "--y",
            cell.y
        );


        if (cell.obstacle) {

            element.classList.add(
                "obstacle"
            );

        }


        element.setAttribute(
            "aria-label",
            `${cell.type} X:${cell.x} Y:${cell.y}`
        );


        element.addEventListener(
            "mouseenter",
            () => {

                updateCoordinates(cell);

            }
        );


        fragment.appendChild(element);

    }


    dom.board.appendChild(fragment);

}


export function getCellFromElement(element) {

    const id =
        element?.dataset?.id;

    if (!id) {
        return null;
    }

    return state.cells.find(
        cell =>
            cell.id === id
    ) || null;

}


export function selectCell(cell) {

    for (const current of state.cells) {

        current.selected =
            false;

    }


    cell.selected =
        true;


    document
        .querySelectorAll(".cell.selected")
        .forEach(element => {

            element.classList.remove(
                "selected"
            );

        });


    const element =
        document.querySelector(
            `[data-id="${cell.id}"]`
        );


    if (element) {

        element.classList.add(
            "selected"
        );

    }


    state.selectedCell =
        cell;

    updateCoordinates(cell);

}


export function clearSelection() {

    state.selectedCell =
        null;


    for (const cell of state.cells) {

        cell.selected =
            false;

    }


    document
        .querySelectorAll(".cell.selected")
        .forEach(element => {

            element.classList.remove(
                "selected"
            );

        });

    updateCoordinates(null);

}


export function refreshBoard() {

    for (const cell of state.cells) {

        const element =
            document.querySelector(
                `[data-id="${cell.id}"]`
            );


        if (!element) {
            continue;
        }


        element.className =
            `cell ${cell.type} player-${cell.owner}`;


        if (cell.obstacle) {

            element.classList.add(
                "obstacle"
            );

        }


        if (cell.selected) {

            element.classList.add(
                "selected"
            );

        }

    }

}