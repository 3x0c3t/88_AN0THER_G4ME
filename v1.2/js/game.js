import { state } from "./state.js";

import {
    createBoard,
    clearSelection,
    refreshBoard
} from "./board.js";

import {
    updateAction,
    refreshUI,
    notify
} from "./ui.js";


export function newGame() {

    state.currentPlayer =
        1;

    state.turn =
        1;

    state.score =
        0;

    state.boardRotation =
        0;

    state.selectedCell =
        null;

    state.gameActive =
        true;


    createBoard();

    refreshUI();

    updateAction(
        "SELECT A CELL"
    );


    notify(
        "NEW GAME"
    );

}


export function resetGame() {

    clearSelection();

    state.score =
        0;

    state.turn =
        1;

    state.currentPlayer =
        1;

    state.boardRotation =
        0;


    document
        .querySelector("#board")
        ?.style.setProperty(
            "--board-rotation",
            "0deg"
        );


    refreshBoard();

    refreshUI();

    updateAction(
        "SELECT A CELL"
    );


    notify(
        "GAME RESET"
    );

}


export function performAction() {

    const cell =
        state.selectedCell;


    if (!cell) {

        updateAction(
            "SELECT A CELL"
        );

        notify(
            "NO CELL SELECTED"
        );

        return;

    }


    if (cell.obstacle) {

        notify(
            "CELL BLOCKED"
        );

        return;

    }


    cell.owner =
        state.currentPlayer;


    state.score++;


    refreshBoard();

    refreshUI();

    updateAction(
        "CELL CLAIMED"
    );


    notify(
        `${cell.type.toUpperCase()} CLAIMED`
    );

}


export function endTurn() {

    state.currentPlayer++;


    if (
        state.currentPlayer >
        8
    ) {

        state.currentPlayer =
            1;

        state.turn++;

    }


    clearSelection();

    refreshUI();

    updateAction(
        `PLAYER ${String(state.currentPlayer).padStart(2, "0")}`
    );


    notify(
        `PLAYER ${String(state.currentPlayer).padStart(2, "0")}`
    );

}