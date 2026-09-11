"use strict";


/* ============================================================
   ETAT
   ============================================================ */

let board = null;

let boardRotation = 0;

let isRotating = false;

let rotationStartAngle = 0;

let rotationStartValue = 0;

let pointerStartX = 0;

let pointerStartY = 0;

let hasDragged = false;

const ROTATION_THRESHOLD = 5;


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
   ROTATION
   ============================================================ */

export function getRotation() {

    return boardRotation;

}


export function setRotation(
    value
) {

    boardRotation =
        Number(
            value
        ) || 0;

}


/* ============================================================
   APPLICATION
   ============================================================ */

export function updateRotation() {

    const container =
        getBoard();

    if (
        !container
    ) {

        return;

    }

    container.style.setProperty(
        "--board-rotation",
        `${boardRotation}deg`
    );

}


/* ============================================================
   ANGLE POINTEUR
   ============================================================ */

function getPointerAngle(
    event
) {

    const container =
        getBoard();

    const rect =
        container.getBoundingClientRect();

    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;

    return (
        Math.atan2(
            event.clientY -
                centerY,
            event.clientX -
                centerX
        )
        *
        180
        /
        Math.PI
    );

}


/* ============================================================
   POINTER DOWN
   ============================================================ */

function handlePointerDown(
    event
) {

    if (
        event.button !== 0
    ) {

        return;

    }

    const container =
        getBoard();

    isRotating = true;

    hasDragged = false;

    pointerStartX =
        event.clientX;

    pointerStartY =
        event.clientY;

    rotationStartAngle =
        getPointerAngle(
            event
        );

    rotationStartValue =
        boardRotation;

    container.classList.add(
        "is-rotating"
    );

    container.setPointerCapture(
        event.pointerId
    );

}


/* ============================================================
   POINTER MOVE
   ============================================================ */

function handlePointerMove(
    event
) {

    if (
        !isRotating
    ) {

        return;

    }

    const dx =
        event.clientX -
        pointerStartX;

    const dy =
        event.clientY -
        pointerStartY;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    if (
        distance >
        ROTATION_THRESHOLD
    ) {

        hasDragged = true;

    }

    const currentAngle =
        getPointerAngle(
            event
        );

    let delta =
        currentAngle -
        rotationStartAngle;

    if (
        delta > 180
    ) {

        delta -= 360;

    }

    if (
        delta < -180
    ) {

        delta += 360;

    }

    boardRotation =
        rotationStartValue +
        delta;

    updateRotation();

}


/* ============================================================
   POINTER UP
   ============================================================ */

function handlePointerUp(
    event
) {

    if (
        !isRotating
    ) {

        return;

    }

    const container =
        getBoard();

    isRotating = false;

    container.classList.remove(
        "is-rotating"
    );

    try {

        container.releasePointerCapture(
            event.pointerId
        );

    }

    catch (
        error
    ) {

    }

}


/* ============================================================
   ETAT DRAG
   ============================================================ */

export function wasDragged() {

    if (
        hasDragged
    ) {

        hasDragged = false;

        return true;

    }

    return false;

}


/* ============================================================
   INITIALISATION
   ============================================================ */

export function initRotation() {

    const container =
        getBoard();

    if (
        !container
    ) {

        return;

    }

    container.addEventListener(
        "pointerdown",
        handlePointerDown
    );

    container.addEventListener(
        "pointermove",
        handlePointerMove
    );

    container.addEventListener(
        "pointerup",
        handlePointerUp
    );

    container.addEventListener(
        "pointercancel",
        handlePointerUp
    );

    updateRotation();

}