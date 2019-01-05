class Player {
    constructor(name, id, token, active = false) {
        this.name = name;
        // o or x
        this.token = token;
        this.id = id;
        // location of svg file
        this.svg = `img/${this.token}.svg`;
        // set if player is a current player (false by default)
        this.active = active;
    }
    /**
     * Getter to get handler of player's header
     */
    get playerHTMLHeader() {
        return document.getElementById(`player${this.id}`);
    }
    /**
     * Method applies player's move
     * @param  {object or integer} box - Li element (box on the board) or location of the box in virtualBoard array
     * @param  {array} boardState - Array with board state
     */
    makeMove(box, boardState) {
        let index;
        if (box && typeof box === 'object') {
            index = box.id.split('-')[1] - 1;
            box.className += ` box-filled-${this.id}`;
        } else {
            index = box;
        }
        
        boardState[index] = this.token;
    }

}