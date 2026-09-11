"use strict";

import {
    createBoard,
    getTiles,
    findTile
} from "./board.js";

import {
    PLAYERS
} from "./player.js";

import {
    updateRotation,
    getRotation,
    setRotation,
    initRotation
} from "./rotation.js";

import {
    initInteraction,
    selectTile,
    getSelectedTile,
    clearSelection
} from "./interaction.js";

import {
    updateTurnDisplay,
    updateScoreDisplay,
    updateCoordinates,
    setAction,
    showNotification,
    clearInspector
} from "./ui.js";

import {
    saveGameData,
    loadGameData
} from "./save.js";


/* ============================================================
   ETAT DU JEU
   ============================================================ */

let currentPlayer = 1;

let turn = 1;

let score = 0;


/* ============================================================
   ACCES ETAT
   ============================================================ */

export function getGameState() {

    return {
        currentPlayer,
        turn,
        score,
        boardRotation: getRotation(),
        selectedTile: getSelectedTile()
    };

}


/* ============================================================
   TOUR SUIVANT
   ============================================================ */

export function endTurn() {

    currentPlayer++;

    if (
        currentPlayer >
        PLAYERS
    ) {

        currentPlayer = 1;

        turn++;

    }

    clearSelection();

    updateTurnDisplay(
        currentPlayer,
        turn
    );

    setAction(
        "SELECT A TILE"
    );

    showNotification(
        `PLAYER ${currentPlayer} TURN`
    );

}


/* ============================================================
   SCORE
   ============================================================ */

export function addScore(
    value
) {

    score += value;

    if (
        score < 0
    ) {

        score = 0;

    }

    updateScoreDisplay(
        score
    );

}


/* ============================================================
   NOUVELLE PARTIE
   ============================================================ */

export function newGame() {

    currentPlayer = 1;

    turn = 1;

    score = 0;

    setRotation(
        0
    );

    clearSelection();

    createBoard();

    updateTurnDisplay(
        currentPlayer,
        turn
    );

    updateScoreDisplay(
        score
    );

    updateCoordinates(
        0,
        0
    );

    setAction(
        "SELECT A TILE"
    );

    clearInspector();

    showNotification(
        "NEW GAME STARTED"
    );

}


/* ============================================================
   RESET
   ============================================================ */

export function resetGame() {

    newGame();

    showNotification(
        "GAME RESET"
    );

}


/* ============================================================
   SAUVEGARDE
   ============================================================ */

export function saveGame() {

    const state =
        getGameState();

    saveGameData(
        state
    );

}


/* ============================================================
   CHARGEMENT
   ============================================================ */

export function loadGame() {

    const data =
        loadGameData();

    if (
        !data
    ) {

        showNotification(
            "NO SAVE FOUND"
        );

        return;

    }

    currentPlayer =
        Math.max(
            1,
            Math.min(
                PLAYERS,
                Number(
                    data.currentPlayer
                ) || 1
            )
        );

    turn =
        Math.max(
            1,
            Number(
                data.turn
            ) || 1
        );

    score =
        Math.max(
            0,
            Number(
                data.score
            ) || 0
        );

    setRotation(
        Number(
            data.boardRotation
        ) || 0
    );

    createBoard();

    updateRotation();

    updateTurnDisplay(
        currentPlayer,
        turn
    );

    updateScoreDisplay(
        score
    );

    if (
        data.selectedTile
    ) {

        const tile =
            findTile(
                data.selectedTile
            );

        if (
            tile
        ) {

            selectTile(
                tile
            );

        }

    }

    showNotification(
        "GAME LOADED"
    );

}


/* ============================================================
   ACTION PRINCIPALE
   ============================================================ */

export function executeAction() {

    const tile =
        getSelectedTile();

    if (
        !tile
    ) {

        showNotification(
            "SELECT A TILE FIRST"
        );

        return;

    }

    showNotification(
        "ACTION ON SELECTED TILE"
    );

}


/* ============================================================
   MENU
   ============================================================ */

function initMenu() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action]"
                );

            if (
                !button
            ) {

                return;

            }

            const action =
                button.dataset.action;

            switch (
                action
            ) {

                case "new":

                    newGame();

                    break;


                case "save":

                    saveGame();

                    break;


                case "load":

                    loadGame();

                    break;


                case "settings":

                    showNotification(
                        "SETTINGS v1.2"
                    );

                    break;


                case "end":

                    endTurn();

                    break;


                case "reset":

                    resetGame();

                    break;


                case "action":

                    executeAction();

                    break;


                case "inventory":

                    showNotification(
                        "INVENTORY"
                    );

                    break;


                case "map":

                    showNotification(
                        "MAP ACTIVE"
                    );

                    break;


                case "stats":

                    showNotification(
                        `SCORE ${score}`
                    );

                    break;


                case "help":

                    showNotification(
                        "DRAG MAP TO ROTATE"
                    );

                    break;

            }

        }
    );

}


/* ============================================================
   CLAVIER
   ============================================================ */

function initKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            switch (
                event.key.toLowerCase()
            ) {

                case "n":

                    newGame();

                    break;


                case "s":

                    saveGame();

                    break;


                case "l":

                    loadGame();

                    break;


                case "r":

                    resetGame();

                    break;


                case "e":

                case "enter":

                    endTurn();

                    break;


                case "escape":

                    clearSelection();

                    setAction(
                        "SELECT A TILE"
                    );

                    clearInspector();

                    break;


                case "arrowleft":

                    setRotation(
                        getRotation() - 5
                    );

                    updateRotation();

                    break;


                case "arrowright":

                    setRotation(
                        getRotation() + 5
                    );

                    updateRotation();

                    break;

            }

        }
    );

}


/* ============================================================
   INITIALISATION DU JEU
   ============================================================ */

export function initGame() {

    initRotation();

    createBoard();

    initInteraction({

        onScore: () => {

            addScore(
                10
            );

        },

        onCoordinates:
            updateCoordinates,

        onAction:
            setAction,

        onNotification:
            showNotification

    });

    initMenu();

    initKeyboard();

    updateTurnDisplay(
        currentPlayer,
        turn
    );

    updateScoreDisplay(
        score
    );

    updateCoordinates(
        0,
        0
    );

    setAction(
        "SELECT A TILE"
    );

    clearInspector();

}