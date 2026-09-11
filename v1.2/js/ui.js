"use strict";


/* ============================================================
   ELEMENTS
   ============================================================ */

const notification =
    document.getElementById(
        "notification"
    );

const turnDisplay =
    document.getElementById(
        "turn"
    );

const scoreDisplay =
    document.getElementById(
        "score"
    );

const actionDisplay =
    document.getElementById(
        "action"
    );

const coordinatesDisplay =
    document.getElementById(
        "coordinates"
    );


/* ============================================================
   TOUR
   ============================================================ */

export function updateTurnDisplay(
    player,
    turn
) {

    if (
        turnDisplay
    ) {

        turnDisplay.textContent =
            String(
                turn
            ).padStart(
                2,
                "0"
            );

    }

    const playerDisplay =
        document.querySelector(
            ".player-info strong"
        );

    if (
        playerDisplay
    ) {

        playerDisplay.textContent =
            `PLAYER ${String(
                player
            ).padStart(
                2,
                "0"
            )}`;

    }

}


/* ============================================================
   SCORE
   ============================================================ */

export function updateScoreDisplay(
    score
) {

    if (
        scoreDisplay
    ) {

        scoreDisplay.textContent =
            String(
                score
            ).padStart(
                3,
                "0"
            );

    }

}


/* ============================================================
   COORDONNEES
   ============================================================ */

export function updateCoordinates(
    x,
    y
) {

    if (
        !coordinatesDisplay
    ) {

        return;

    }

    coordinatesDisplay.innerHTML =
        `X: ${formatCoordinate(x)}&nbsp;&nbsp;Y: ${formatCoordinate(y)}`;

}


/* ============================================================
   FORMAT COORDONNEE
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
        ).padStart(
            2,
            "0"
        );

    }

    return number
        .toFixed(
            1
        );

}


/* ============================================================
   ACTION
   ============================================================ */

export function setAction(
    message
) {

    if (
        actionDisplay
    ) {

        actionDisplay.textContent =
            message;

    }

}


/* ============================================================
   NOTIFICATION
   ============================================================ */

export function showNotification(
    message
) {

    if (
        !notification
    ) {

        return;

    }

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    clearTimeout(
        notification._timer
    );

    notification._timer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* ============================================================
   INSPECTEUR
   ============================================================ */

export function clearInspector() {

    const inspector =
        document.getElementById(
            "cellInspector"
        );

    if (
        inspector
    ) {

        inspector.classList.remove(
            "visible"
        );

    }

}