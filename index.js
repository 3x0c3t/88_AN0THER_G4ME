/* ==========================================================
   88_AN0THER_G4ME
   INDEX.JS
   ========================================================== */


/* ==========================================================
   CONFIGURATION DU PLATEAU
   ========================================================== */

const PLAYERS = 8;

const RINGS = 5;

const TILES_PER_RING = [
    1,
    2,
    3,
    4,
    5
];

const CENTER_PLAYER = 0;


/* ==========================================================
   DOM
   ========================================================== */

const board = document.getElementById("board");
const scoreElement = document.getElementById("score");
const turnElement = document.getElementById("turn");
const coordinatesElement = document.getElementById("coordinates");
const notification = document.getElementById("notification");


/* ==========================================================
   ÉTAT DU JEU
   ========================================================== */

let score = 0;
let turn = 1;
let selectedTile = null;


/* ==========================================================
   JOUEURS
   ========================================================== */

const playerColors = [
    "cyan",
    "green",
    "orange",
    "red",
    "violet",
    "blue",
    "yellow",
    "pink"
];


/* ==========================================================
   OBSTACLES
   ========================================================== */

const obstacles = [
    [1, 2, 1],
    [2, 3, 2],
    [3, 2, 3],
    [4, 4, 4],
    [5, 2, 5],
    [6, 3, 6],
    [7, 2, 7],
    [8, 4, 8]
];


/* ==========================================================
   CRÉATION DU PLATEAU
   ========================================================== */

function createBoard() {

    board.innerHTML = "";

    selectedTile = null;

    let tileId = 0;


    /*
     * CASE CENTRALE
     */

    const centerTile = document.createElement("div");

    centerTile.classList.add(
        "tile",
        "center-tile"
    );

    centerTile.dataset.id = tileId++;
    centerTile.dataset.player = CENTER_PLAYER;
    centerTile.dataset.ring = 0;
    centerTile.dataset.position = 0;

    centerTile.addEventListener(
        "mouseenter",
        () => updateCoordinates(0, 0, 0)
    );

    centerTile.addEventListener(
        "click",
        () => selectTile(
            centerTile,
            0,
            0,
            0
        )
    );

    board.appendChild(centerTile);


    /*
     * 8 SECTEURS
     */

    for (let player = 1; player <= PLAYERS; player++) {

        const sector = document.createElement("div");

        sector.classList.add(
            "sector-layer",
            `sector-${player}`
        );

        sector.dataset.player = player;


        /*
         * LABEL DU JOUEUR
         */

        const label = document.createElement("div");

        label.classList.add(
            "sector-label"
        );

        label.textContent =
            `PLAYER ${String(player).padStart(2, "0")}`;

        sector.appendChild(label);


        /*
         * CASES DU SECTEUR
         */

        for (
            let ring = 1;
            ring <= RINGS;
            ring++
        ) {

            const count =
                TILES_PER_RING[ring - 1];


            for (
                let position = 0;
                position < count;
                position++
            ) {

                const tile =
                    document.createElement("div");

                tile.classList.add(
                    "tile",
                    `player-${player}`
                );


                /*
                 * POSITION ANGULAIRE
                 *
                 * Chaque secteur fait 45°.
                 */

                const sectorAngle =
                    (player - 1) * 45;

                const sectorStep =
                    45 / count;

                const angle =
                    sectorAngle +
                    sectorStep * (position + 0.5);


                /*
                 * POSITION RADIALE
                 */

                const radius =
                    72 +
                    (ring - 1) * 64;


                /*
                 * COORDONNÉES
                 */

                tile.style.setProperty(
                    "--radius",
                    `${radius}px`
                );

                tile.style.setProperty(
                    "--angle",
                    `${angle}deg`
                );


                /*
                 * DONNÉES
                 */

                tile.dataset.id = tileId++;

                tile.dataset.player =
                    player;

                tile.dataset.ring =
                    ring;

                tile.dataset.position =
                    position;


                /*
                 * OBSTACLE
                 */

                if (
                    isObstacle(
                        player,
                        ring,
                        position
                    )
                ) {

                    tile.classList.add(
                        "obstacle"
                    );

                }


                /*
                 * ÉVÉNEMENTS
                 */

                tile.addEventListener(
                    "mouseenter",
                    () =>
                        updateCoordinates(
                            player,
                            ring,
                            position
                        )
                );

                tile.addEventListener(
                    "click",
                    () =>
                        selectTile(
                            tile,
                            player,
                            ring,
                            position
                        )
                );


                sector.appendChild(tile);

            }

        }


        board.appendChild(sector);

    }

}


/* ==========================================================
   OBSTACLE
   ========================================================== */

function isObstacle(
    player,
    ring,
    position
) {

    return obstacles.some(
        obstacle =>
            obstacle[0] === player &&
            obstacle[1] === ring &&
            obstacle[2] === position
    );

}


/* ==========================================================
   COORDONNÉES
   ========================================================== */

function updateCoordinates(
    player,
    ring,
    position
) {

    if (player === 0) {

        coordinatesElement.textContent =
            "CENTER";

        return;

    }


    coordinatesElement.textContent =
        `P: ${String(player).padStart(2, "0")}   ` +
        `R: ${String(ring).padStart(2, "0")}   ` +
        `C: ${String(position + 1).padStart(2, "0")}`;

}


/* ==========================================================
   SÉLECTION
   ========================================================== */

function selectTile(
    tile,
    player,
    ring,
    position
) {

    if (
        tile.classList.contains(
            "obstacle"
        )
    ) {

        notify(
            "CASE INACCESSIBLE"
        );

        return;

    }


    if (selectedTile) {

        selectedTile.classList.remove(
            "selected"
        );

    }


    selectedTile = tile;

    selectedTile.classList.add(
        "selected"
    );


    score += 10;

    updateInterface();


    if (player === 0) {

        notify(
            "CENTRE DU PLATEAU"
        );

    } else {

        notify(
            `PLAYER ${String(player).padStart(2, "0")} ` +
            `R${ring}:${position + 1}`
        );

    }

}


/* ==========================================================
   INTERFACE
   ========================================================== */

function updateInterface() {

    scoreElement.textContent =
        String(score).padStart(
            4,
            "0"
        );

    turnElement.textContent =
        String(turn).padStart(
            2,
            "0"
        );

}


/* ==========================================================
   NOTIFICATION
   ========================================================== */

function notify(message) {

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    clearTimeout(
        notify.timer
    );

    notify.timer =
        setTimeout(
            () =>
                notification.classList.remove(
                    "show"
                ),
            1400
        );

}


/* ==========================================================
   ACTIONS DES MENUS
   ========================================================== */

document
    .querySelectorAll("[data-action]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                switch (action) {

                    case "new":
                        newGame();
                        break;

                    case "save":
                        notify(
                            "GAME SAVED"
                        );
                        break;

                    case "settings":
                        notify(
                            "SETTINGS"
                        );
                        break;

                    case "inventory":
                        notify(
                            "INVENTORY"
                        );
                        break;

                    case "map":
                        notify(
                            "8 PLAYER MAP"
                        );
                        break;

                    case "stats":
                        notify(
                            `SCORE ${String(score).padStart(4, "0")}`
                        );
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

                    case "help":
                        notify(
                            "SELECT A TILE"
                        );
                        break;

                }

            }
        );

    });


/* ==========================================================
   ACTION DE JEU
   ========================================================== */

function performAction() {

    if (!selectedTile) {

        notify(
            "AUCUNE CASE SÉLECTIONNÉE"
        );

        return;

    }


    score += 50;

    updateInterface();

    notify(
        "ACTION +50"
    );

}


/* ==========================================================
   FIN DU TOUR
   ========================================================== */

function endTurn() {

    turn++;


    if (selectedTile) {

        selectedTile.classList.remove(
            "selected"
        );

    }


    selectedTile = null;

    updateInterface();


    notify(
        `TOUR ${String(turn).padStart(2, "0")}`
    );

}


/* ==========================================================
   NOUVELLE PARTIE
   ========================================================== */

function newGame() {

    score = 0;

    turn = 1;

    createBoard();

    updateInterface();

    notify(
        "NEW GAME"
    );

}


/* ==========================================================
   RESET
   ========================================================== */

function resetGame() {

    score = 0;

    turn = 1;

    createBoard();

    updateInterface();

    notify(
        "GAME RESET"
    );

}


/* ==========================================================
   CLAVIER
   ========================================================== */

document.addEventListener(
    "keydown",
    event => {

        switch (
            event.key.toLowerCase()
        ) {

            case "n":
                newGame();
                break;

            case "r":
                resetGame();
                break;

            case "enter":
                performAction();
                break;

            case "escape":

                if (selectedTile) {

                    selectedTile.classList.remove(
                        "selected"
                    );

                }

                selectedTile = null;

                break;

            case "e":
                endTurn();
                break;

        }

    }
);


/* ==========================================================
   INITIALISATION
   ========================================================== */

createBoard();

updateInterface();