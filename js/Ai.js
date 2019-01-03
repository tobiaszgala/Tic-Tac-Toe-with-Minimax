class Ai extends Player {
    constructor(name, id, token, level) {
        super(name, id, token);
        this.depth = 0;
        this.level = level;
    }
    /**
     * Function generates Ai move based on level
     * @param  {object} game - Main game object (We could also create static methods and access them in our class)
     * @returns - Null if error occured
     */
    makeAiMove(game) {
        const boardState = game.board.virtualBoard;
        if      (this.level === 'novice')  return this.minimax(game, game.players[1], boardState, 8).index;
        else if (this.level === 'average') return this.minimax(game, game.players[1], boardState, 6).index;
        else if (this.level === 'master')  return this.minimax(game, game.players[1], boardState, 0).index;
        else 
            return null;
    }
    /**
     * Function generates based move for Ai player (depending on depth)
     * @param  {object} game - Main game object
     * @param  {object} player - Current player
     * @param  {array} boardState - Current board state
     * @param  {integer} depth - How many board states we should omit / Less is harder
     */
    minimax(game, player, boardState, depth) {
        // if human player wins 
        if (game.checkWin(game.players[0])) {
            return { score: depth - 10 };
        // if ai player wins
        } else if (game.checkWin(game.players[1])) {
            return { score: 10 - depth };
        // if there is a draw
        } else if (game.checkDraw()) {
            return { score: 0 };
        } else {
            // minimax
            let bestMove, bestScore;
            let values = [];
            // loop and check every spot on the board
            for (let i = 0; i < boardState.length; i++) {
                // if spot is empty  
                if (boardState[i] === null) {
                    let value = {};
                    // player makes move
                    player.makeMove(i, boardState);
                    // switch player
                    const currentPlayer = (player === game.players[0]) ? game.players[1] : game.players[0];
                    // recursive call of minimax on empty spot
                    const result = this.minimax(game, currentPlayer, boardState, depth + 1);
                    // set index of the position
                    value.index = i;
                    // set score for the position
                    value.score = result.score;
                    // reset spot because you will move outer loop to next spot
                    boardState[i] = null;
                    // save value to the group
                    values.push(value);
                }
            }
            // finding min and max from array of objects
            // find best move for Ai player
            if (player === game.players[1]) {
                bestScore = -Infinity;
                for (let i = 0; i < values.length; i++) {
                    if (values[i].score > bestScore) {
                        bestScore = values[i].score;
                        bestMove = i;
                    }
                }
            // find best move for human player
            } else {
                bestScore = Infinity;
                for (let i = 0; i < values.length; i++) {
                    if (values[i].score < bestScore) {
                        bestScore = values[i].score;
                        bestMove = i;
                    }
                }
            }
            return values[bestMove];
        }
    }
}