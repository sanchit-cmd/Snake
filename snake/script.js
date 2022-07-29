const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext('2d');

const scoreText = document.querySelector('#score');
const resetBtn = document.querySelector('#resetBtn');

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = 'White';
const snakeColor = 'lightgreen';
const snakeBorder = 'black';
const foodColor = 'red';

const unitSize = 25;

let running = false;

let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;

let score = 0;

let snake = [
	{ x: unitSize * 2, y: 0 },
	{ x: unitSize * 1, y: 0 },
	{ x: 0, y: 0 },
];

const gameStart = function () {
	running = true;

	scoreText.textContent = score;
	createFood();
	drawFood();
	nextTick();
};

const nextTick = function () {
	if (running) {
		setTimeout(() => {
			clearBoard();
			// no create food here
			drawFood();
			moveSnake();
			drawSnake();
			checkGameOver();
			nextTick();
		}, 75);
	} else {
		displayGameOver();
	}
};

const clearBoard = function () {
	ctx.fillStyle = boardBackground;
	ctx.fillRect(0, 0, gameWidth, gameHeight);
};

const createFood = function () {
	const randomFood = function (min, max) {
		const randNum =
			Math.round((Math.random() * (max - min) + min) / unitSize) *
			unitSize;
		return randNum;
	};
	foodX = randomFood(0, gameWidth - unitSize);
	foodY = randomFood(0, gameHeight - unitSize);

	console.log(foodX, foodY);
};

const drawFood = function () {
	ctx.fillStyle = foodColor;
	ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

const moveSnake = function () {
	const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
	snake.unshift(head);

	// if food is eaten
	if (snake[0].x === foodX && snake[0].y === foodY) {
		score += 1;
		scoreText.textContent = score;
		createFood();
	} else {
		snake.pop();
	}
};

const drawSnake = function () {
	ctx.fillStyle = snakeColor;
	ctx.strokeStyle = snakeBorder;
	snake.forEach(snakePart => {
		ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
		ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
	});
};

const changeDirection = function (e) {
	const keyPressed = e.keyCode;
	console.log(keyPressed);
	const LEFT = 37;
	const RIGHT = 39;
	const UP = 38;
	const DOWN = 40;

	const goingUp = yVelocity === -unitSize;
	const goingDown = yVelocity === unitSize;
	const goingLeft = xVelocity === -unitSize;
	const goingRight = xVelocity === unitSize;

	switch (true) {
		case keyPressed == LEFT && !goingRight:
			xVelocity = -unitSize;
			yVelocity = 0;
			break;

		case keyPressed == UP && !goingDown:
			xVelocity = 0;
			yVelocity = -unitSize;
			break;

		case keyPressed == RIGHT && !goingLeft:
			xVelocity = unitSize;
			yVelocity = 0;
			break;

		case keyPressed == DOWN && !goingUp:
			xVelocity = 0;
			yVelocity = unitSize;
			break;
	}
};

const checkGameOver = function () {
	switch (true) {
		case snake[0].x < 0 + unitSize:
			running = false;
			break;

		case snake[0].x >= gameWidth - unitSize:
			running = false;
			break;

		case snake[0].y < 0:
			running = false;
			break;

		case snake[0].y >= gameHeight - unitSize:
			running = false;
			break;
	}

	for (let i = 1; i < snake.length; i++) {
		if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
			running = false;
		}
	}
};

const displayGameOver = function () {
	ctx.font = '50px Consolas';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.fillText('Game Over!', gameWidth / 2, gameHeight / 2);
	running = false;
};

const resetGame = function () {
	score = 0;
	xVelocity = unitSize;
	yVelocity = 0;

	snake = [
		{ x: unitSize * 2, y: 0 },
		{ x: unitSize * 1, y: 0 },
		{ x: 0, y: 0 },
	];

	gameStart();
};

window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);

gameStart();
