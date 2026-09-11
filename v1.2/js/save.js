"use strict";


const SAVE_KEY =
    "88_AN0THER_G4ME_SAVE";


/* ============================================================
   SAUVEGARDE
   ============================================================ */

export function saveGameData(
    state
) {

    const data = {

        currentPlayer:
            state.currentPlayer,

        turn:
            state.turn,

        score:
            state.score,

        boardRotation:
            state.boardRotation,

        selectedTile:
            state.selectedTile
                ? {

                    grid:
                        state.selectedTile
                            .dataset.grid,

                    shape:
                        state.selectedTile
                            .dataset.shape,

                    x:
                        Number(
                            state.selectedTile
                                .dataset.x
                        ),

                    y:
                        Number(
                            state.selectedTile
                                .dataset.y
                        )

                }
                : null,

        savedAt:
            new Date()
                .toISOString()

    };


    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(
            data
        )
    );


    const notification =
        document.getElementById(
            "notification"
        );

    if (
        notification
    ) {

        notification.textContent =
            "GAME SAVED";

        notification.classList.add(
            "show"
        );

    }

}


/* ============================================================
   CHARGEMENT
   ============================================================ */

export function loadGameData() {

    const saved =
        localStorage.getItem(
            SAVE_KEY
        );

    if (
        !saved
    ) {

        return null;

    }

    try {

        return JSON.parse(
            saved
        );

    }

    catch (
        error
    ) {

        console.error(
            "INVALID SAVE",
            error
        );

        return null;

    }

}