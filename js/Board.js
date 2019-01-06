class Board {
    constructor() {
        // number of boxes on the board - 9 set to default
        this.numOfBoxes = 9;
        // array that holds copy of board state in order for Ai to work faster
        this.virtualBoard = [];
        // array with references to boxes on the board
        this.allLiBoxes = [];
    }
    /**
     * Method creates empty li element
     * @param  {integer} id - ID that will help in finding box on the board
     * @returns - Li element (box on the board)
     */
    createBox(id) {
        const box = document.createElement('li');
        box.id = `box-${id + 1}`;
        box.className = 'box';
        
        // push reference of the box inside allLiBoxes array
        this.allLiBoxes.push(box);
        // set box to null (empty) on virtualBoard array
        this.virtualBoard.push(null);
        return box;
    }
    /**
     * Method creates board by genereting ul element
     * @returns - UL element
     */
    drawHTMLBoard() {
        const boxesUl = document.createElement('ul');
        boxesUl.id = 'boxes';
        boxesUl.className = 'boxes';

        for (let i = 0; i < this.numOfBoxes; i++) {
            boxesUl.appendChild(this.createBox(i));
        }

        return boxesUl;
    }
    /**
     * Method resets board state
     */
    resetBoard() {
        // reset virtual board by setting null values in each spot
        for (let i = 0; i < this.virtualBoard.length; i++) {
            this.virtualBoard[i] = null;
        }
        // reset li elements with default class and delete style attribute for mouseover styles
        for (let box of this.allLiBoxes) {
            box.className = 'box';
            box.removeAttribute('style');
        }
    }
}