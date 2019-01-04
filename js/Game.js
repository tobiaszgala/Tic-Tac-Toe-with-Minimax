class Game {
    constructor(names, aiLevel = false) {
        this.board = new Board();
        this.players = this.createPlayers(names, aiLevel);
        this.ready = true;
    }
    /**
     * Getter for active player
     */
    get activePlayer() {
        return this.players.find(player => player.active === true);
    }
    /**
     * Function creates new player objects
     * @param  {array} names - Array with names of players
     * @param  {string} aiLevel - Difficulty level of Ai (false) by default
     * @returns - Array with players objects
     */
    createPlayers(names, aiLevel) {
        if (names[1] === 'Computer' && aiLevel !== false) {
            return [new Player(names[0], 1, 'o', true),
                    new Ai(names[1], 2, 'x', aiLevel)];
        } else {
            return [new Player(names[0], 1, 'o', true),
                    new Player(names[1], 2, 'x')];
        }
    }
    /**
     * Function switches active state of players
     */
    switchPlayers() {
        for (let player of this.players) {
            player.active = (player.active === true) ? false : true;
        }
    }
    /**
     * Function resets players headers by removing active css class and setting default css class
     */
    resetPlayersHeader() {
        for (let player of this.players) {
            player.playerHTMLHeader.className = 'players';
        }
    }
    /**
     * Function handles click event
     * @param  {object} e - Li element (box on the board)
     */
    handleClick(e) {
        // if game state is ready player can make a move
        if (this.ready) {
            // if box is empty
            if (e.className === 'box') {
                // reset players headers
                this.resetPlayersHeader();
                // apply players move
                this.activePlayer.makeMove(e, this.board.virtualBoard);
                // check if there is a win
                if (this.checkWin(this.activePlayer)) {
                    // show game over window with players name
                    this.gameOver(this.activePlayer);
                // check if there is a draw
                } else if (this.checkDraw()) {
                    // display draw window
                    this.gameOver(null, true);
                } else {
                    // switch active state for players
                    this.switchPlayers();
                    // set header for new active player
                    this.activePlayer.playerHTMLHeader.className += ' active';
                    // if new player is Ai player
                    if (this.activePlayer instanceof Ai) {
                        // set game state to false to disable click event
                        this.ready = false;
                        // pretend that ai is thinking by using setTimeout
                        setTimeout(() => {
                            // calculate move of Ai player
                            const aiMove = this.activePlayer.makeAiMove(this);
                            // we want to make verify and make sure that aiMove is ready before setting game state ready to true
                            if (aiMove !== null && typeof aiMove === 'number') {
                                this.ready = true;
                                // recursive function call to apply ai move
                                // pointing to reference of the box
                                this.handleClick(this.board.allLiBoxes[aiMove]);
                            }
                        }, 600);

                    }
                }
            }
        }
    }
    /**
     * Function handles mouseover and mouseout event. Displayes player's token over empty spot
     * @param  {object} e - Li element (box on the board)
     * @param  {boolean} out=false - False for mouseover (default) and true for mouseout
     */
    handleMouseEnter(e, out = false) {
        if (this.ready) {
            if (e.className === 'box') {
                if (out) {
                    e.removeAttribute('style');
                } else {
                    e.style.backgroundImage = `url(${this.activePlayer.svg})`;
                }
            }
        }
    }
    /**
     * Function checks if there is a winner
     * @param  {object} player - Player object
     * @returns - True of winner is found / False if not
     */
    checkWin(player) {
        const token = player.token;
        const boxes = this.board.virtualBoard;
       
        /*
            We could create array with winning combinations and just compare them with boxes array
            but by dynamically finding winning combinations it will be easier to implement 
            checkWin function with different board sizes.
        */

        // horizontal
        for (let i = 0; i < 7; i += 3) {
            if (boxes[i] === token
                && boxes[i + 1] === token
                && boxes[i + 2] === token)

                return true;
        }

        // vertical
        for (let i = 0; i < 3; i++) {
            if (boxes[i] === token
                && boxes[i + 3] === token
                && boxes[i + 6] === token)

                return true;
        }

        // diagonal
        for (let i = 0; i < 3; i += 2) {
            
            const side = (i === 0) ? 4 : 2;

            if (boxes[i] === token
                && boxes[i + side] === token
                && boxes[side * 2 + i] === token)

                return true;
        }

        return false;
    }
    /**
     * Function checks for the draw
     * @returns - True if there is a draw / False if not
     */
    checkDraw() {
        const boxes = this.board.virtualBoard;
        
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i] === null) return false;
        }

        return true;
    }
    /**
     * Function displays game over window with winner's name or draw
     * @param  {object} winner - Player who won
     * @param  {boolean} draw=false - True if there was a draw / False if not (default)
     */
    gameOver(winner, draw = false) {
        let winnerWindow = false;

        if (draw)
            winnerWindow = this.drawGameOverWindow('tie', "It's a draw!");
        else
            winnerWindow = this.drawGameOverWindow(winner.token, `${winner.name} wins!`);

        if (winnerWindow) document.body.appendChild(winnerWindow);

    }
    /**
     * Function creates html element responsible for game over window
     * @param  {object} winner - Player who won
     * @param  {string} message - Message to be displayed
     * @returns - Div element
     */
    drawGameOverWindow(winner, message) {
        const winnerDiv = document.createElement('div');
        const header = document.createElement('header');
        const h1 = document.createElement('h1');
        const p = document.createElement('p');
        const a = document.createElement('a');

        winnerDiv.className = `screen screen-win screen-win-${winner}`;
        h1.textContent = 'Tic Tac Toe';
        p.textContent = message;
        a.href = '#';
        a.className = 'button';
        a.textContent = 'New game';

        // adding event listener before append to make sure that it will ready before DOM
        a.addEventListener('click', () => {
            // reload app window
            window.location.reload();
        });

        header.appendChild(h1);
        header.appendChild(p);
        header.appendChild(a);
        winnerDiv.appendChild(header);

        return winnerDiv;
    }
}