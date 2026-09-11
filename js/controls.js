import {
    newGame,
    resetGame,
    performAction,
    endTurn
} from "./game.js";

import {
    saveGame
} from "./storage.js";

import {
    notify
} from "./ui.js";


export function initControls() {

    document
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    handleAction(
                        button.dataset.action
                    );

                }
            );

        });


    document.addEventListener(
        "keydown",
        handleKeyboard
    );

}


function handleAction(action) {

    switch (action) {

        case "new":
            newGame();
            break;


        case "save":
            saveGame();
            break;


        case "action":
            performAction();
            break;


        case "end":
            endTurn();
            break;


        case "reset":
            resetGame();
            break;


        case "inventory":
            notify("INVENTORY");
            break;


        case "map":
            notify("MAP");
            break;


        case "stats":
            notify("STATISTICS");
            break;


        case "settings":
            notify("SETTINGS");
            break;


        case "help":
            notify(
                "CLICK CELL · DRAG MAP"
            );
            break;

    }

}


function handleKeyboard(event) {

    switch (event.key.toLowerCase()) {

        case "n":
            newGame();
            break;


        case "s":
            saveGame();
            break;


        case "enter":
            performAction();
            break;


        case "e":
            endTurn();
            break;


        case "r":
            resetGame();
            break;

    }

}