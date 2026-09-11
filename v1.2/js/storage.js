import { state } from "./state.js";

import {
    notify,
    refreshUI
} from "./ui.js";

import {
    refreshBoard
} from "./board.js";


export function saveGame() {

    const data = {

        currentPlayer:
            state.currentPlayer,

        turn:
            state.turn,

        score:
            state.score,

        boardRotation:
            state.boardRotation,

        cells:
            state.cells.map(cell => ({

                id:
                    cell.id,

                owner:
                    cell.owner,

                selected:
                    cell.selected

            }))

    };


    localStorage.setItem(
        "88_AN0THER_G4ME_v1.2",
        JSON.stringify(data)
    );


    notify(
        "GAME SAVED"
    );

}


export function loadGame() {

    const raw =
        localStorage.getItem(
            "88_AN0THER_G4ME_v1.2"
        );


    if (!raw) {
        return false;
    }


    try {

        const data =
            JSON.parse(raw);


        state.currentPlayer =
            data.currentPlayer ?? 1;


        state.turn =
            data.turn ?? 1;


        state.score =
            data.score ?? 0;


        state.boardRotation =
            data.boardRotation ?? 0;


        for (
            const savedCell of
            data.cells || []
        ) {

            const cell =
                state.cells.find(
                    current =>
                        current.id ===
                        savedCell.id
                );


            if (!cell) {
                continue;
            }


            cell.owner =
                savedCell.owner;

            cell.selected =
                savedCell.selected;

        }


        refreshBoard();

        refreshUI();


        document
            .querySelector("#board")
            ?.style.setProperty(
                "--board-rotation",
                `${state.boardRotation}deg`
            );


        notify(
            "GAME LOADED"
        );


        return true;

    }
    catch {

        notify(
            "LOAD ERROR"
        );

        return false;

    }

}