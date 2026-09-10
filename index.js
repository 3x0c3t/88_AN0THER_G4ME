/* ============================================================
   88_AN0THER_G4ME
   OCTO GRID
   Version v1.0

   Grille :
   - 8 joueurs maximum
   - 8 secteurs de 45°
   - grille continue
   - cellules octogonales adjacentes
   - centre commun
   ============================================================ */

"use strict";

/* ============================================================
   CONFIGURATION
   ============================================================ */

const PLAYERS = 8;

const GRID_RADIUS = 7;

const TILE_SIZE = 42;
const TILE_STEP = 40;

const SECTOR_OFFSET = -90;

const CENTER_PLAYER = 0;


/* ============================================================
   ÉTAT DU JEU
   ============================================================ */

let currentPlayer = 1;
let turn = 1;
let score = 0;

let selectedTile = null;
let gameStarted = true;

let tiles = [];


/* ============================================================
   DOM
   ============================================================ */

const board = document.getElementById("board");

const notification = document.getElementById("notification");

const turnDisplay = document.getElementById("turn");
const scoreDisplay = document.getElementById("score");

const actionDisplay = document.getElementById("action");

const endTurnButton = document.getElementById("end-turn");
const resetButton = document.getElementById("reset-game");

const newGameButton = document.getElementById("new-game");
const saveButton = document.getElementById("save-game");
const settingsButton = document.getElementById("settings");


/* ============================================================
   COULEURS JOUEURS
   ============================================================ */

const PLAYER_COLORS = {
    1: "#00e5ff",
    2: "#00ff99",
    3: "#ffe600",
    4: "#ff9d00",
    5: "#ff4057",
    6: "#ff5fcf",
    7: "#b56cff",
    8: "#3d8bff"
};


/* ============================================================
   OBSTACLES
   ============================================================ */

const OBSTACLES = [
    { player: 1, x: -2, y: -5 },
    { player: 2, x: 2, y: -4 },
    { player: 3, x: 5, y: -2 },
    { player: 4, x: 4, y: 3 },
    { player: 5, x: 2, y: 5 },
    { player: 6, x: -2, y: 5 },
    { player: 7, x: -5, y: 2 },
    { player: 8, x: -4, y: -3 }
];


/* ============================================================
   UTILITAIRES
   ============================================================ */

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


function distanceFromCenter(x, y) {
    return Math.sqrt((x * x) + (y * y));
}


/* ============================================================
   DÉTERMINATION DU SECTEUR
   ============================================================ */

function getPlayerFromPosition(x, y) {

    if (x === 0 && y === 0) {
        return CENTER_PLAYER;
    }

    let angle = Math.atan2(y, x) * 180 / Math.PI;

    angle -= SECTOR_OFFSET;

    while (angle < 0) {
        angle += 360;
    }

    while (angle >= 360) {
        angle -= 360;
    }

    const sector = Math.floor(angle / 45);

    return (sector % PLAYERS) + 1;
}


/* ============================================================
   TEST APPARTENANCE À LA GRILLE
   ============================================================ */

function isInsideBoard(x, y) {

    const distance = distanceFromCenter(x, y);

    /*
     * La limite légèrement supérieure permet de conserver
     * une silhouette circulaire imparfaite composée d'octogones.
     */
    return distance <= GRID_RADIUS + 0.35;
}


/* ============================================================
   CRÉATION D'UNE CELLULE
   ============================================================ */

function createTile(x, y) {

    const tile = document.createElement("div");

    tile.className = "tile";

    const player = getPlayerFromPosition(x, y);

    tile.dataset.x = x;
    tile.dataset.y = y;
    tile.dataset.player = player;

    tile.style.setProperty("--x", `${x * TILE_STEP}px`);
    tile.style.setProperty("--y", `${y * TILE_STEP}px`);

    tile.style.setProperty(
        "--player-color",
        player === 0
            ? "#00e5ff"
            : PLAYER_COLORS[player]
    );

    if (x === 0 && y === 0) {

        tile.classList.add("center-tile");

        tile.innerHTML = `
            <span class="tile-center-mark">8</span>
        `;

    } else {

        tile.innerHTML = `
            <span class="tile-number">${player}</span>
        `;
    }

    /*
     * Marquage du secteur.
     */
    if (player > 0) {
        tile.classList.add(`player-${player}`);
    }

    /*
     * Obstacle.
     */
    const obstacle = OBSTACLES.find(
        item => item.x === x && item.y === y
    );

    if (obstacle) {

        tile.classList.add("obstacle");

        tile.dataset.obstacle = "true";

        tile.innerHTML = `
            <span class="obstacle-mark">×</span>
        `;
    }

    /*
     * Interaction.
     */
    tile.addEventListener("click", handleTileClick);

    tile.addEventListener("mouseenter", handleTileEnter);

    tile.addEventListener("mouseleave", handleTileLeave);

    board.appendChild(tile);

    tiles.push(tile);
}


/* ============================================================
   CRÉATION DE LA GRILLE
   ============================================================ */

function createBoard() {

    board.innerHTML = "";

    tiles = [];

    for (let y = -GRID_RADIUS; y <= GRID_RADIUS; y++) {

        for (let x = -GRID_RADIUS; x <= GRID_RADIUS; x++) {

            if (!isInsideBoard(x, y)) {
                continue;
            }

            createTile(x, y);
        }
    }

    /*
     * Le centre est toujours créé.
     */
    if (!tiles.some(tile =>
        Number(tile.dataset.x) === 0 &&
        Number(tile.dataset.y) === 0
    )) {
        createTile(0, 0);
    }
}


/* ============================================================
   CLICK CELLULE
   ============================================================ */

function handleTileClick(event) {

    const tile = event.currentTarget;

    const x = Number(tile.dataset.x);
    const y = Number(tile.dataset.y);

    const player = Number(tile.dataset.player);

    /*
     * Centre.
     */
    if (x === 0 && y === 0) {

        selectTile(tile);

        showNotification("CENTRAL TILE SELECTED");

        return;
    }

    /*
     * Obstacle.
     */
    if (tile.dataset.obstacle === "true") {

        showNotification("TILE BLOCKED");

        return;
    }

    /*
     * Sélection.
     */
    selectTile(tile);

    score += 10;

    updateScore();

    actionDisplay.textContent =
        `P${currentPlayer} SELECTED X${x} Y${y}`;

    showNotification(
        `PLAYER ${currentPlayer} → TILE P${player} [${x}, ${y}]`
    );
}


/* ============================================================
   SÉLECTION
   ============================================================ */

function selectTile(tile) {

    if (selectedTile) {
        selectedTile.classList.remove("selected");
    }

    selectedTile = tile;

    if (selectedTile) {
        selectedTile.classList.add("selected");
    }
}


/* ============================================================
   SURVOL
   ============================================================ */

function handleTileEnter(event) {

    const tile = event.currentTarget;

    const x = tile.dataset.x;
    const y = tile.dataset.y;
    const player = tile.dataset.player;

    actionDisplay.textContent =
        `P${player} · X${x} · Y${y}`;
}


function handleTileLeave() {

    if (selectedTile) {

        const x = selectedTile.dataset.x;
        const y = selectedTile.dataset.y;

        actionDisplay.textContent =
            `SELECTED X${x} Y${y}`;

    } else {

        actionDisplay.textContent = "SELECT A TILE";
    }
}


/* ============================================================
   FIN DU TOUR
   ============================================================ */

function endTurn() {

    currentPlayer++;

    if (currentPlayer > PLAYERS) {
        currentPlayer = 1;
        turn++;
    }

    updateTurn();

    selectTile(null);

    actionDisplay.textContent = "SELECT A TILE";

    showNotification(
        `PLAYER ${currentPlayer} TURN`
    );
}


/* ============================================================
   NOUVELLE PARTIE
   ============================================================ */

function newGame() {

    currentPlayer = 1;

    turn = 1;

    score = 0;

    selectedTile = null;

    gameStarted = true;

    createBoard();

    updateTurn();

    updateScore();

    actionDisplay.textContent = "SELECT A TILE";

    showNotification("NEW GAME STARTED");
}


/* ============================================================
   RESET
   ============================================================ */

function resetGame() {

    currentPlayer = 1;

    turn = 1;

    score = 0;

    selectedTile = null;

    createBoard();

    updateTurn();

    updateScore();

    actionDisplay.textContent = "SELECT A TILE";

    showNotification("GAME RESET");
}


/* ============================================================
   SCORE
   ============================================================ */

function updateScore() {

    if (scoreDisplay) {
        scoreDisplay.textContent =
            String(score).padStart(3, "0");
    }
}


/* ============================================================
   TOUR
   ============================================================ */

function updateTurn() {

    if (turnDisplay) {
        turnDisplay.textContent =
            String(turn).padStart(2, "0");
    }

    const playerLabels =
        document.querySelectorAll(".player-number");

    playerLabels.forEach(label => {

        label.classList.remove("active");

        if (
            Number(label.dataset.player) === currentPlayer
        ) {
            label.classList.add("active");
        }
    });
}


/* ============================================================
   NOTIFICATION
   ============================================================ */

function showNotification(message) {

    if (!notification) {
        return;
    }

    notification.textContent = message;

    notification.classList.add("visible");

    clearTimeout(notification._timer);

    notification._timer = setTimeout(() => {

        notification.classList.remove("visible");

    }, 1800);
}


/* ============================================================
   SAUVEGARDE LOCALE
   ============================================================ */

function saveGame() {

    const data = {

        currentPlayer,

        turn,

        score,

        selectedTile: selectedTile
            ? {
                x: Number(selectedTile.dataset.x),
                y: Number(selectedTile.dataset.y)
            }
            : null,

        savedAt: new Date().toISOString()
    };

    localStorage.setItem(
        "88_AN0THER_G4ME_SAVE",
        JSON.stringify(data)
    );

    showNotification("GAME SAVED");
}


/* ============================================================
   CHARGEMENT
   ============================================================ */

function loadGame() {

    const saved =
        localStorage.getItem("88_AN0THER_G4ME_SAVE");

    if (!saved) {

        showNotification("NO SAVE FOUND");

        return;
    }

    try {

        const data = JSON.parse(saved);

        currentPlayer =
            clamp(
                Number(data.currentPlayer) || 1,
                1,
                PLAYERS
            );

        turn =
            Math.max(
                1,
                Number(data.turn) || 1
            );

        score =
            Math.max(
                0,
                Number(data.score) || 0
            );

        createBoard();

        updateTurn();

        updateScore();

        selectTile(null);

        if (data.selectedTile) {

            const tile = tiles.find(tile =>
                Number(tile.dataset.x) ===
                    Number(data.selectedTile.x) &&
                Number(tile.dataset.y) ===
                    Number(data.selectedTile.y)
            );

            if (tile) {
                selectTile(tile);
            }
        }

        showNotification("GAME LOADED");

    } catch (error) {

        console.error(error);

        showNotification("INVALID SAVE");
    }
}


/* ============================================================
   SETTINGS
   ============================================================ */

function openSettings() {

    showNotification(
        "SETTINGS NOT AVAILABLE IN v1.0"
    );
}


/* ============================================================
   CLAVIER
   ============================================================ */

document.addEventListener("keydown", event => {

    switch (event.key.toLowerCase()) {

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
            selectTile(null);
            actionDisplay.textContent =
                "SELECT A TILE";
            break;
    }
});


/* ============================================================
   BOUTONS
   ============================================================ */

if (endTurnButton) {
    endTurnButton.addEventListener(
        "click",
        endTurn
    );
}

if (resetButton) {
    resetButton.addEventListener(
        "click",
        resetGame
    );
}

if (newGameButton) {
    newGameButton.addEventListener(
        "click",
        newGame
    );
}

if (saveButton) {
    saveButton.addEventListener(
        "click",
        saveGame
    );
}

if (settingsButton) {
    settingsButton.addEventListener(
        "click",
        openSettings
    );
}


/* ============================================================
   INITIALISATION
   ============================================================ */

createBoard();

updateTurn();

updateScore();

actionDisplay.textContent = "SELECT A TILE";

console.log(
    "88_AN0THER_G4ME v1.0 initialized"
);