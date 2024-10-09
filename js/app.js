var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var gBoard;
var gGamerPos;

let countWins = 0;
let countBall = 2;
let intervalBalls = null;

function initGame() {
	countWins = 0;
    countBall = 2;
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	renderRestartButton('none')
	renderCountWins(countWins);
	addBalls();
}

function renderCountWins(countWins) {
	let numberOFwins = document.getElementById('countWins');
	numberOFwins.innerHTML = countWins;
}

function renderRestartButton(mode) {
	const restartButton = document.getElementById('restart');
	restartButton.style.display = mode;
}

function addBalls() {
	intervalBalls = setInterval(() => {
		let cell;
		let row;
		let column;
		do {
			row = Math.floor(Math.random() * 8) + 1;
			column = Math.floor(Math.random() * 10) + 1;
			cell = document.getElementsByClassName(`cell cell-${row}-${column} floor`)[0];
		} while (!cell || cell.querySelector('img')); 

		cell.insertAdjacentHTML('beforeend', BALL_IMG);
		gBoard[row][column].gameElement = BALL;
		countBall++;
	}, 3000);
}

function checkWin(countBall) {
	if (!countBall) {
		alert('winner!!');
		clearInterval(intervalBalls);
		renderRestartButton('block')
	}
}

function buildBoard() {
	// Create the Matrix
	// var board = createMat(10, 12)
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			cellClass += currCell.type === FLOOR ? ' floor' : ' wall';

			strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i}, ${j})">\n`;

			switch (currCell.gameElement) {
				case GAMER:
					strHTML += GAMER_IMG;
					break;
				case BALL:
					strHTML += BALL_IMG;
					break;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!');
			renderCountWins(++countWins);
			checkWin(--countBall);
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	console.log('cellClass:', cellClass);
	return cellClass;
}

