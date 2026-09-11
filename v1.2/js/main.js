import { dom } from "./dom.js";

import {
    createBoard
} from "./board.js";

import {
    initInteraction
} from "./interaction.js";

import {
    initControls
} from "./controls.js";

import {
    refreshUI,
    updateAction
} from "./ui.js";


export function initGame() {

    dom.init();

    createBoard();

    initInteraction();

    initControls();

    refreshUI();

    updateAction(
        "SELECT A CELL"
    );

}