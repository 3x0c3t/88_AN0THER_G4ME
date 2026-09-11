import { dom } from "./dom.js";

import { state } from "./state.js";

import {
    getCellFromElement,
    selectCell
} from "./board.js";

import {
    updateAction
} from "./ui.js";


export function initInteraction() {

    dom.board.addEventListener(
        "click",
        handleClick
    );


    dom.board.addEventListener(
        "pointerdown",
        startRotation
    );


    window.addEventListener(
        "pointermove",
        rotateBoard
    );


    window.addEventListener(
        "pointerup",
        stopRotation
    );

}


function handleClick(event) {

    if (state.isRotating) {
        return;
    }


    const element =
        event.target.closest(
            ".cell"
        );


    if (!element) {
        return;
    }


    const cell =
        getCellFromElement(element);


    if (!cell) {
        return;
    }


    selectCell(cell);


    if (cell.obstacle) {

        updateAction(
            "OBSTACLE"
        );

        return;
    }


    updateAction(
        cell.type === "octagon"
            ? "OCTAGON SELECTED"
            : "SQUARE SELECTED"
    );

}


function startRotation(event) {

    if (
        event.target.closest(".cell")
    ) {
        return;
    }


    state.isRotating =
        true;


    state.dragStartX =
        event.clientX;


    state.dragStartY =
        event.clientY;


    state.rotationStart =
        state.boardRotation;


    dom.board.classList.add(
        "is-rotating"
    );


    dom.board.setPointerCapture?.(
        event.pointerId
    );

}


function rotateBoard(event) {

    if (!state.isRotating) {
        return;
    }


    const dx =
        event.clientX -
        state.dragStartX;


    const dy =
        event.clientY -
        state.dragStartY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const direction =
        dx + dy;


    const rotation =
        state.rotationStart +
        (
            direction >= 0
                ? distance
                : -distance
        ) *
        0.35;


    state.boardRotation =
        rotation;


    dom.board.style.setProperty(
        "--board-rotation",
        `${rotation}deg`
    );

}


function stopRotation() {

    if (!state.isRotating) {
        return;
    }


    state.isRotating =
        false;


    dom.board.classList.remove(
        "is-rotating"
    );

}