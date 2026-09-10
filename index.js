/* ============================================================
   88_AN0THER_G4ME
   OCTO GRID
   v1.0

   MAP :
   - plateau circulaire
   - 8 secteurs de 45°
   - 8 joueurs
   - rotation libre du plateau
   - montagne centrale 3 x 3
   ============================================================ */

"use strict";


/* ============================================================
   CONFIGURATION
   ============================================================ */

const PLAYERS = 8;

const GRID_RADIUS = 7;

const SECTOR_ANGLE = 360 / PLAYERS;

const CENTER_PLAYER = 0;


/* ============================================================
   ÉTAT
   ============================================================ */

let currentPlayer = 1;

let turn = 1;

let score = 0;

let selectedTile = null;

let tiles = [];


/* ============================================================
   ROTATION
   ============================================================ */

let boardRotation = 0;

let isRotating = false;

let rotationStartAngle = 0;

let rotationStartValue = 0;

let pointerStartX = 0;

let pointerStartY = 0;

let hasDragged = false;


/*
 * Distance minimale avant de considérer
 * le mouvement comme une rotation.
 */
const ROTATION_THRESHOLD = 5;


/* ============================================================
   DOM
   ============================================================ */

const board =
    document.getElementById("board");

const notification =
    document.getElementById(
        "notification"
    );

const turnDisplay =
    document.getElementById("turn");

const scoreDisplay =
    document.getElementById("score");

const actionDisplay =
    document.getElementById("action");

const coordinatesDisplay =
    document.getElementById(
        "coordinates"
    );


/* ============================================================
   COULEURS
   ============================================================ */

const PLAYER_COLORS = {

    1: "#00e5ff",

    2: "#00ff99",

    3: "#ffe600",

    4: "#ff4057",

    5: "#ff8a00",

    6: "#ff3bd4",

    7: "#a855ff",

    8: "#3d8bff"

};


/* ============================================================
   OBSTACLES
   ============================================================ */

const OBSTACLES = [

    {
        player: 1,
        x: -2,
        y: -5
    },

    {
        player: 2,
        x: 2,
        y: -4
    },

    {
        player: 3,
        x: 5,
        y: -2
    },

    {
        player: 4,
        x: 4,
        y: 3
    },

    {
        player: 5,
        x: 2,
        y: 5
    },

    {
        player: 6,
        x: -2,
        y: 5
    },

    {
        player: 7,
        x: -5,
        y: 2
    },

    {
        player: 8,
        x: -4,
        y: -3
    }

];


/* ============================================================
   MONTAGNE CENTRALE
   ============================================================ */

function isMountainTile(x, y) {

    return (

        Math.max(
            Math.abs(x),
            Math.abs(y)
        ) <= 1

    );

}


/* ============================================================
   DISTANCE
   ============================================================ */

function distanceFromCenter(x, y) {

    return Math.sqrt(
        x * x +
        y * y
    );

}


/* ============================================================
   APPARTENANCE AU PLATEAU
   ============================================================ */

function isInsideBoard(x, y) {

    return (

        distanceFromCenter(x, y)
        <=
        GRID_RADIUS + 0.35

    );

}


/* ============================================================
   DÉTERMINATION DU JOUEUR
   ============================================================ */

function getPlayerFromPosition(
    x,
    y
) {

    if (
        isMountainTile(x, y)
    ) {

        return CENTER_PLAYER;

    }


    let angle =
        Math.atan2(y, x)
        *
        180
        /
        Math.PI;


    /*
     * Rotation logique initiale.
     *
     * Le premier secteur commence
     * vers le haut.
     */
    angle += 90;


    while (
        angle < 0
    ) {

        angle += 360;

    }


    while (
        angle >= 360
    ) {

        angle -= 360;

    }


    const sector =
        Math.floor(
            angle /
            SECTOR_ANGLE
        );


    return (
        sector + 1
    );

}


/* ============================================================
   CRÉATION CELLULE
   ============================================================ */

function createTile(
    x,
    y
) {

    const tile =
        document.createElement(
            "div"
        );


    tile.className =
        "tile";


    tile.dataset.x =
        String(x);


    tile.dataset.y =
        String(y);


    tile.style.setProperty(
        "--x",
        String(x)
    );


    tile.style.setProperty(
        "--y",
        String(y)
    );


    /*
     * MONTAGNE
     */
    if (
        isMountainTile(x, y)
    ) {

        tile.classList.add(
            "mountain-tile"
        );


        tile.dataset.player =
            String(CENTER_PLAYER);


        tile.dataset.mountain =
            "true";


        if (
            x === 0 &&
            y === 0
        ) {

            tile.classList.add(
                "mountain-center"
            );


            tile.innerHTML = `
                <span class="mountain-mark">
                    ◆
                </span>
            `;

        } else {

            tile.innerHTML = `
                <span class="mountain-mark">
                    ◇
                </span>
            `;

        }

    }


    /*
     * TERRAIN JOUEUR
     */
    else {

        const player =
            getPlayerFromPosition(
                x,
                y
            );


        tile.dataset.player =
            String(player);


        tile.classList.add(
            `player-${player}`
        );


        tile.style.setProperty(
            "--player-color",
            PLAYER_COLORS[player]
        );


        tile.innerHTML = `
            <span class="tile-number">
                ${player}
            </span>
        `;

    }


    /*
     * OBSTACLE
     */
    const obstacle =
        OBSTACLES.find(
            item =>
                item.x === x &&
                item.y === y
        );


    if (obstacle) {

        tile.classList.add(
            "obstacle"
        );


        tile.dataset.obstacle =
            "true";


        tile.innerHTML = `
            <span class="obstacle-mark">
                ×
            </span>
        `;

    }


    /*
     * ÉVÉNEMENTS
     */
    tile.addEventListener(
        "click",
        handleTileClick
    );


    tile.addEventListener(
        "mouseenter",
        handleTileEnter
    );


    tile.addEventListener(
        "mouseleave",
        handleTileLeave
    );


    board.appendChild(
        tile
    );


    tiles.push(
        tile
    );

}


/* ============================================================
   CRÉATION PLATEAU
   ============================================================ */

function createBoard() {

    if (!board) {

        return;

    }


    board.innerHTML =
        "";


    tiles = [];


    for (
        let y = -GRID_RADIUS;
        y <= GRID_RADIUS;
        y++
    ) {

        for (
            let x = -GRID_RADIUS;
            x <= GRID_RADIUS;
            x++
        ) {

            if (
                !isInsideBoard(
                    x,
                    y
                )
            ) {

                continue;

            }


            createTile(
                x,
                y
            );

        }

    }


    updateBoardRotation();

}


/* ============================================================
   ROTATION VISUELLE
   ============================================================ */

function updateBoardRotation() {

    if (!board) {

        return;

    }


    board.style.setProperty(
        "--board-rotation",
        `${boardRotation}deg`
    );

}


/* ============================================================
   ANGLE D'UN POINT AUTOUR DU CENTRE
   ============================================================ */

function getPointerAngle(
    event
) {

    const rect =
        board.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;


    const centerY =
        rect.top +
        rect.height / 2;


    return (

        Math.atan2(
            event.clientY - centerY,
            event.clientX - centerX
        )

        *

        180
        /
        Math.PI

    );

}


/* ============================================================
   DÉBUT ROTATION
   ============================================================ */

function handlePointerDown(
    event
) {

    if (
        event.button !== 0
    ) {

        return;

    }


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


    board.classList.add(
        "is-rotating"
    );


    board.setPointerCapture(
        event.pointerId
    );

}


/* ============================================================
   ROTATION
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


    /*
     * Corrige le passage
     * +180 / -180.
     */
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


    updateBoardRotation();

}


/* ============================================================
   FIN ROTATION
   ============================================================ */

function handlePointerUp(
    event
) {

    if (
        !isRotating
    ) {

        return;

    }


    isRotating = false;


    board.classList.remove(
        "is-rotating"
    );


    try {

        board.releasePointerCapture(
            event.pointerId
        );

    } catch (
        error
    ) {

        /*
         * Rien à faire.
         */

    }

}


/* ============================================================
   CLICK CELLULE
   ============================================================ */

function handleTileClick(
    event
) {

    /*
     * Si le clic vient d'un drag,
     * on ne sélectionne pas la cellule.
     */
    if (
        hasDragged
    ) {

        hasDragged = false;

        return;

    }


    const tile =
        event.currentTarget;


    const x =
        Number(
            tile.dataset.x
        );


    const y =
        Number(
            tile.dataset.y
        );


    const player =
        Number(
            tile.dataset.player
        );


    updateCoordinates(
        x,
        y
    );


    /*
     * MONTAGNE
     */
    if (
        tile.dataset.mountain ===
        "true"
    ) {

        selectTile(
            tile
        );


        setAction(
            `MOUNTAIN · X${x} · Y${y}`
        );


        showNotification(
            "CENTRAL MOUNTAIN"
        );


        return;

    }


    /*
     * OBSTACLE
     */
    if (
        tile.dataset.obstacle ===
        "true"
    ) {

        showNotification(
            "TILE BLOCKED"
        );


        return;

    }


    /*
     * SÉLECTION
     */
    selectTile(
        tile
    );


    score += 10;


    updateScore();


    setAction(
        `P${player} · X${x} · Y${y}`
    );


    showNotification(
        `PLAYER ${currentPlayer} → P${player}`
    );

}


/* ============================================================
   SÉLECTION
   ============================================================ */

function selectTile(
    tile
) {

    if (
        selectedTile
    ) {

        selectedTile.classList.remove(
            "selected"
        );

    }


    selectedTile =
        tile;


    if (
        selectedTile
    ) {

        selectedTile.classList.add(
            "selected"
        );

    }

}


/* ============================================================
   HOVER
   ============================================================ */

function handleTileEnter(
    event
) {

    if (
        isRotating
    ) {

        return;

    }


    const tile =
        event.currentTarget;


    const x =
        Number(
            tile.dataset.x
        );


    const y =
        Number(
            tile.dataset.y
        );


    updateCoordinates(
        x,
        y
    );


    if (
        tile.dataset.mountain ===
        "true"
    ) {

        setAction(
            `MOUNTAIN · X${x} · Y${y}`
        );


        return;

    }


    const player =
        tile.dataset.player;


    setAction(
        `PLAYER ${player} · X${x} · Y${y}`
    );

}


/* ============================================================
   FIN HOVER
   ============================================================ */

function handleTileLeave() {

    if (
        selectedTile
    ) {

        const x =
            selectedTile.dataset.x;


        const y =
            selectedTile.dataset.y;


        if (
            selectedTile.dataset.mountain ===
            "true"
        ) {

            setAction(
                `MOUNTAIN · X${x} · Y${y}`
            );

        } else {

            setAction(
                `SELECTED · X${x} · Y${y}`
            );

        }


        return;

    }


    setAction(
        "SELECT A TILE"
    );

}


/* ============================================================
   COORDONNÉES
   ============================================================ */

function updateCoordinates(
    x,
    y
) {

    if (
        !coordinatesDisplay
    ) {

        return;

    }


    const format =
        value =>
            String(value)
                .padStart(
                    2,
                    "0"
                );


    coordinatesDisplay.innerHTML =
        `X: ${format(x)}&nbsp;&nbsp;Y: ${format(y)}`;

}


/* ============================================================
   ACTION
   ============================================================ */

function setAction(
    message
) {

    if (
        !actionDisplay
    ) {

        return;

    }


    actionDisplay.textContent =
        message;

}


/* ============================================================
   FIN DU TOUR
   ============================================================ */

function endTurn() {

    currentPlayer++;


    if (
        currentPlayer >
        PLAYERS
    ) {

        currentPlayer =
            1;

        turn++;

    }


    updateTurn();


    selectTile(
        null
    );


    setAction(
        "SELECT A TILE"
    );


    showNotification(
        `PLAYER ${currentPlayer} TURN`
    );

}


/* ============================================================
   NOUVELLE PARTIE
   ============================================================ */

function newGame() {

    currentPlayer =
        1;

    turn =
        1;

    score =
        0;

    selectedTile =
        null;

    boardRotation =
        0;


    createBoard();


    updateTurn();

    updateScore();

    updateCoordinates(
        0,
        0
    );


    setAction(
        "SELECT A TILE"
    );


    showNotification(
        "NEW GAME STARTED"
    );

}


/* ============================================================
   RESET
   ============================================================ */

function resetGame() {

    currentPlayer =
        1;

    turn =
        1;

    score =
        0;

    selectedTile =
        null;

    boardRotation =
        0;


    createBoard();


    updateTurn();

    updateScore();


    updateCoordinates(
        0,
        0
    );


    setAction(
        "SELECT A TILE"
    );


    showNotification(
        "GAME RESET"
    );

}


/* ============================================================
   SCORE
   ============================================================ */

function updateScore() {

    if (
        !scoreDisplay
    ) {

        return;

    }


    scoreDisplay.textContent =
        String(score)
            .padStart(
                3,
                "0"
            );

}


/* ============================================================
   TOUR
   ============================================================ */

function updateTurn() {

    if (
        turnDisplay
    ) {

        turnDisplay.textContent =
            String(turn)
                .padStart(
                    2,
                    "0"
                );

    }


    const player =
        document.querySelector(
            ".player-info strong"
        );


    if (
        player
    ) {

        player.textContent =
            `PLAYER ${String(currentPlayer).padStart(2, "0")}`;

    }

}


/* ============================================================
   NOTIFICATION
   ============================================================ */

function showNotification(
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
        "visible"
    );


    clearTimeout(
        notification._timer
    );


    notification._timer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "visible"
                );

            },
            1800
        );

}


/* ============================================================
   SAUVEGARDE
   ============================================================ */

function saveGame() {

    const data = {

        currentPlayer,

        turn,

        score,

        boardRotation,

        selectedTile:

            selectedTile

                ? {

                    x:
                        Number(
                            selectedTile.dataset.x
                        ),

                    y:
                        Number(
                            selectedTile.dataset.y
                        )

                }

                : null,

        savedAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "88_AN0THER_G4ME_SAVE",
        JSON.stringify(data)
    );


    showNotification(
        "GAME SAVED"
    );

}


/* ============================================================
   CHARGEMENT
   ============================================================ */

function loadGame() {

    const saved =
        localStorage.getItem(
            "88_AN0THER_G4ME_SAVE"
        );


    if (
        !saved
    ) {

        showNotification(
            "NO SAVE FOUND"
        );


        return;

    }


    try {

        const data =
            JSON.parse(
                saved
            );


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


        boardRotation =
            Number(
                data.boardRotation
            ) || 0;


        createBoard();


        updateTurn();

        updateScore();

        updateBoardRotation();


        if (
            data.selectedTile
        ) {

            const tile =
                tiles.find(
                    item =>

                        Number(
                            item.dataset.x
                        ) ===
                        Number(
                            data.selectedTile.x
                        )

                        &&

                        Number(
                            item.dataset.y
                        ) ===
                        Number(
                            data.selectedTile.y
                        )
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


    } catch (
        error
    ) {

        console.error(
            error
        );


        showNotification(
            "INVALID SAVE"
        );

    }

}


/* ============================================================
   BOUTONS DES MENUS
   ============================================================ */

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


            case "settings":

                showNotification(
                    "SETTINGS v1.0"
                );

                break;


            case "end":

                endTurn();

                break;


            case "reset":

                resetGame();

                break;


            case "action":

                if (
                    selectedTile
                ) {

                    showNotification(
                        "ACTION ON SELECTED TILE"
                    );

                } else {

                    showNotification(
                        "SELECT A TILE FIRST"
                    );

                }

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


/* ============================================================
   ROTATION SOURIS / TOUCH
   ============================================================ */

board.addEventListener(
    "pointerdown",
    handlePointerDown
);


board.addEventListener(
    "pointermove",
    handlePointerMove
);


board.addEventListener(
    "pointerup",
    handlePointerUp
);


board.addEventListener(
    "pointercancel",
    handlePointerUp
);


/* ============================================================
   CLAVIER
   ============================================================ */

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


            case "r":

                resetGame();

                break;


            case "e":

            case "enter":

                endTurn();

                break;


            case "escape":

                selectTile(
                    null
                );

                setAction(
                    "SELECT A TILE"
                );

                break;


            case "arrowleft":

                boardRotation -= 5;

                updateBoardRotation();

                break;


            case "arrowright":

                boardRotation += 5;

                updateBoardRotation();

                break;

        }

    }
);


/* ============================================================
   INITIALISATION
   ============================================================ */

createBoard();

updateTurn();

updateScore();

updateCoordinates(
    0,
    0
);

setAction(
    "SELECT A TILE"
);


console.log(
    "88_AN0THER_G4ME v1.0"
);

console.log(
    "8 secteurs · plateau circulaire · rotation libre"
);