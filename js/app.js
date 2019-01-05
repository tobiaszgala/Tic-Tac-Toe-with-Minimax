'use strict';

const startScreen = document.getElementById('start');
const startScreenHeader = startScreen.firstElementChild;
const player1Name = document.getElementById('player1-name');
const player2Name = document.getElementById('player2-name');
const board = document.getElementById('board');
const jsWarrning = document.getElementById('js-warrning');

/**
 * Function filters html tags making sure that user enters only string for player's name
 * @param  {string} html - String or html tag
 * @returns {string} - Filtered player's name or default name
 */
const stripHtml = (html) => {
    const tempDivElement = document.createElement('div');
    tempDivElement.innerHTML = html;
    
    return tempDivElement.textContent || tempDivElement.innerText || "Unknown";
}

/**
 * Function creates button on the page
 * @param  {string} text - TextContent of a button
 * @param  {string} id - ID attribute for created button
 * @returns - A element (button)
 */
const createLinkButton = (text, id) => {
    const button = document.createElement('a');
    button.href = '#';
    button.id = id;
    button.className = 'button';
    button.textContent = text;

    return button;
}

/**
 * Function creates input element on the page
 * @param  {string} text - Placeholder for input
 * @returns - Input element
 */
const createInput = (id, focus = false) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `${id}-label`;
    input.autofocus = focus;

    return input;
}

/**
 * Function creates label element for input
 * @param  {string} text - Label text content
 * @param  {string} id - For attribute for label element
 * @returns - Label element
 */
const createLabel = (text, id) => {
    const label = document.createElement('label');
    label.htmlFor = `${id}-label`;
    label.textContent = `* ${text}`;

    return label;
}

/**
 * Function generates inputs and buttons based on number of players
 * @param  {integer} numOfPlayers - Number of players 1) for Ai 2) For two players
 */
const createInputWindow = (numOfPlayers) => {
    // Remove existing elements on the page to add new options
    const startWindowElements = startScreenHeader.children;
    while (startWindowElements.length > 1) {
        startWindowElements[1].parentNode.removeChild(startWindowElements[1]);
    }

    if (numOfPlayers === 1) {
        startScreenHeader.appendChild(createInput('player1', true));
        startScreenHeader.appendChild(createLabel('name for player', 'player1'));
        startScreenHeader.appendChild(createLinkButton('Novice', 'lvl-novice'));
        startScreenHeader.appendChild(createLinkButton('Average', 'lvl-average'));
        startScreenHeader.appendChild(createLinkButton('Master', 'lvl-master'));
    } else if (numOfPlayers === 2) {
        startScreenHeader.appendChild(createInput('player1', true));
        startScreenHeader.appendChild(createLabel('name for player 1', 'player1'));
        startScreenHeader.appendChild(createInput('player2'));
        startScreenHeader.appendChild(createLabel('name for player 2', 'player2'));
        startScreenHeader.appendChild(createLinkButton('Start Game', 'startgame'));
    }

    // for IE < 10 support
    // selecting first input element with autofocus attr that is not set to focus
    document.querySelector('input[autofocus]:not(:focus)').focus();
}

/**
 * Function generates start screen
 */
const renderApp = () => {
    startScreenHeader.appendChild(createLinkButton('Player vs Player', 'pvp'));
    startScreenHeader.appendChild(createLinkButton('Player vs Ai', 'ai'));
    jsWarrning.parentNode.removeChild(jsWarrning); // Love the logic :)
}

// start app
renderApp();


// event listeners
startScreen.addEventListener('click', (e) => {
    if (e.target.nodeName === 'A') {
        if (e.target.id === 'pvp') {
            // if player vs player create window with 2 players
            createInputWindow(2);
            // set focus to first input element
        } else if (e.target.id === 'ai') {
            // if player vs ai create window with 1 player
            createInputWindow(1);
            // set focus to first input element
        } else if (e.target.id === 'startgame' || e.target.id.indexOf('lvl') > -1) {
            const names = []; 
            let game = {};
            // convert HTMLCollection to array
            const generatedWindowElements = Array.prototype.slice.call(startScreenHeader.children);
            // get only input elements
            const generatedInputs = generatedWindowElements.filter(input => input.nodeName === 'INPUT');

            // if there are more than one input filter all names from inputs and push them to names array
            if (generatedInputs.length > 1) {
                for (let i = 0; i < generatedInputs.length; i++) {
                    names.push(stripHtml(generatedInputs[i].value));
                }
            } else {
            // otherwise filter input and push Computer for the name of second player
                names.push(stripHtml(generatedInputs[0].value));
                names.push('Computer');
            }

            // if level of Ai was choosen 
            if (e.target.id.indexOf('lvl') > -1) {
                // get level from id
                const aiLevel = e.target.id.split("-")[1];
                // start game with names and ai level
                game = new Game(names, aiLevel);
            } else
                // if player vs player start game with just names, ai level is set to false by default
                game = new Game(names);

            // hide start screen and show the board
            startScreen.style.display = 'none';
            board.style.display = 'block';
            // display players names on the page
            player1Name.textContent = game.players[0].name;
            player2Name.textContent = game.players[1].name;
            // draw HTML board 
            board.appendChild(game.board.drawHTMLBoard());
            // add event listeners to the boxes inside generated board
            const boxes = document.getElementById('boxes');
            boxes.addEventListener('click', (e) => {
                if (e.target.nodeName === 'LI') { game.handleClick(e.target); }
            });

            boxes.addEventListener('mouseover', (e) => {
                if (e.target.nodeName === 'LI') { game.handleMouseEnter(e.target); }
            });

            boxes.addEventListener('mouseout', (e) => {
                if (e.target.nodeName === 'LI') { game.handleMouseEnter(e.target, true); }
            }); 
        }
    }
});