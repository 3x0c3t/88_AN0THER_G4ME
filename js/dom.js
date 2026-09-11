export const dom = {

    board: null,

    turn: null,

    score: null,

    action: null,

    coordinates: null,

    notification: null,

    init() {

        this.board =
            document.getElementById("board");

        this.turn =
            document.getElementById("turn");

        this.score =
            document.getElementById("score");

        this.action =
            document.getElementById("action");

        this.coordinates =
            document.getElementById("coordinates");

        this.notification =
            document.getElementById("notification");

    }

};