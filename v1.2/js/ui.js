import { dom } from "./dom.js";
import { state } from "./state.js";

export function updateTurn() {

    dom.turn.textContent =
        String(state.turn).padStart(2, "0");

}


export function updateScore() {

    dom.score.textContent =
        String(state.score).padStart(3, "0");

}


export function updateAction(text) {

    dom.action.textContent = text;

}


export function updateCoordinates(cell) {

    if (!cell) {

        dom.coordinates.innerHTML =
            "X: 00&nbsp;&nbsp;Y: 00";

        return;
    }

    dom.coordinates.innerHTML =
        `X: ${formatCoordinate(cell.x)}&nbsp;&nbsp;Y: ${formatCoordinate(cell.y)}`;

}


function formatCoordinate(value) {

    const number = Number(value);

    if (Number.isInteger(number)) {

        return String(number).padStart(2, "0");

    }

    return number
        .toFixed(1)
        .padStart(4, "0");

}


export function notify(message) {

    dom.notification.textContent =
        message;

    dom.notification.classList.add("visible");

    clearTimeout(notify.timer);

    notify.timer =
        setTimeout(() => {

            dom.notification.classList.remove("visible");

        }, 1800);

}


export function refreshUI() {

    updateTurn();

    updateScore();

}