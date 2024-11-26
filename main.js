"use strict";

import {
	CELL_WIDTH,
	PLAYFIELD,
	TETROMINOS,
} from "./blocks.js";

import {
	VALID_CONTROLLER_KEYS,
	CONTROLLER,
	handleKeyDown,
	handleKeyUp,
} from "./controller.js";

import {
	FPS,
	GRAVITY,
	ARE,
	LINE_ARE,
	DAS,
	LOCK,
	LINE_CLEAR,
} from "./constants.js";

let CURRENT_INPUT = {};
for (let key of VALID_CONTROLLER_KEYS)
	CURRENT_INPUT[key] = 0;

let NEXT_PIECE = "O";
const CURRENT_PIECE = {
	"tetromino": "T",
	"rotation": 0,
	"left": 0,
	"top": 0,
	"onFloor": false,
	"lockTimer": LOCK,
}

function checkCollision()
{
	let rotation = CURRENT_PIECE["rotation"];
	let piece = TETROMINOS[CURRENT_PIECE["tetromino"]]["rotations"][rotation];
	let width = getWidth2DArray(piece);
	let height = getWidth2DArray(piece);

	// prevent the piece from leaving the playfield
	if(CURRENT_PIECE["left"] < 0)
	{
		CURRENT_PIECE["left"] = 0
	}
	if(CURRENT_PIECE["left"] + width > getWidth2DArray(PLAYFIELD))
	{
		CURRENT_PIECE["left"] = getWidth2DArray(PLAYFIELD) - width;
	}
}

function isPieceLocked()
{
	if(checkCollision() && CURRENT_PIECE["lockTimer"] == 0)
		return true
	return false
}

function randomlySelectNextPiece()
{
	return "I";
}

function getValueFrom2DArray(array_2d, x, y)
{
	if (x < 0 || x >= array_2d[0].length || y < 0 || y >= array_2d.length)
		return undefined;
	return array_2d[y][x];
}

function getWidth2DArray(array_2d)
{
	return array_2d[0].length;
}

function getHeight2DArray(array_2d)
{
	return array_2d.length;
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function applyGravity()
{
	CURRENT_PIECE["top"] += GRAVITY;
}

function drawActivePiece()
{
	ctx.fillStyle = TETROMINOS[CURRENT_PIECE["tetromino"]]["color"];
	let rotation = CURRENT_PIECE["rotation"];
	let left = CURRENT_PIECE["left"];
	let top = CURRENT_PIECE["top"];
	let piece = TETROMINOS[CURRENT_PIECE["tetromino"]]["rotations"][rotation];

	let width = getWidth2DArray(piece);
	let height = getHeight2DArray(piece);
	for(let x=0; x < width; x+=1)
	for(let y=0; y < height; y+=1)
	{
		if(piece[y][x] == 1)
		{
			ctx.fillRect(
				(left + x) * CELL_WIDTH,
				(top + y) * CELL_WIDTH,
				CELL_WIDTH,
				CELL_WIDTH,
			);
		}
	}
}

function drawPieceShadow()
{
	let color = TETROMINOS[CURRENT_PIECE["tetromino"]]["color"];
	let opacity = "33";
	ctx.fillStyle = color + opacity;

	let rotation = CURRENT_PIECE["rotation"];
	let left = CURRENT_PIECE["left"];
	let piece = TETROMINOS[CURRENT_PIECE["tetromino"]]["rotations"][rotation];

	let width = getWidth2DArray(piece);
	let height = getHeight2DArray(piece);

	let top = getHeight2DArray(PLAYFIELD) - height;

	for(let x=0; x < width; x+=1)
	for(let y=0; y < height; y+=1)
	{
		if(piece[y][x] == 1)
		{
			ctx.fillRect(
				(left + x) * CELL_WIDTH,
				(top + y) * CELL_WIDTH,
				CELL_WIDTH,
				CELL_WIDTH,
			);
		}
	}
}

function drawPiecePreview(context)
{
	let letter = NEXT_PIECE;
	let color = TETROMINOS[letter]["color"];
	let opacity = "FF";
	context.fillStyle = color + opacity;

	let rotation = 0;
	let top = 0;
	let piece = TETROMINOS[letter]["rotations"][rotation];

	let width = getWidth2DArray(piece);
	let height = getHeight2DArray(piece);

	// center the piece in the canvas
	let left = 0.5 * getWidth2DArray(PLAYFIELD) - 0.5 * width;

	for(let x=0; x < width; x+=1)
	for(let y=0; y < height; y+=1)
	{
		if(piece[y][x] == 1)
		{
			context.fillRect(
				(left + x) * CELL_WIDTH,
				(top + y) * CELL_WIDTH,
				CELL_WIDTH,
				CELL_WIDTH,
			);
		}
	}
}


/*
	Setup the main playfield canvas
*/
const canvas = document.getElementById("playfield");
canvas.width = CELL_WIDTH * 10;
canvas.height = CELL_WIDTH * 20;
const ctx = canvas.getContext("2d");

/*
	Setup the piece preview canvas
*/
const piecePreviewCanvas = document.getElementById("piece-preview");
piecePreviewCanvas.width = CELL_WIDTH * 10;
piecePreviewCanvas.height = CELL_WIDTH * 2;
const piecePreviewCtx = piecePreviewCanvas.getContext("2d");
drawPiecePreview(piecePreviewCtx);


document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);


let FRAME = 0;
function gameLoop()
{
	clearCanvas();

	// translate piece
	let numOfRotations = TETROMINOS[CURRENT_PIECE["tetromino"]]["rotations"].length;
	if(CONTROLLER["KeyX"] === 1 && CURRENT_INPUT["KeyX"] === 0)
	{
		CURRENT_PIECE["rotation"] += 1;
		CURRENT_PIECE["rotation"] %= numOfRotations;
	}
	if(CONTROLLER["KeyZ"] === 1 && CURRENT_INPUT["KeyZ"] === 0)
	{
		CURRENT_PIECE["rotation"] -= 1;
		if(CURRENT_PIECE["rotation"] < 0)
			CURRENT_PIECE["rotation"] = numOfRotations - 1;
	}
	if(CONTROLLER["ArrowLeft"] === 1 && CURRENT_INPUT["ArrowLeft"] === 0)
	{
		CURRENT_PIECE["left"] -= 1;
	}
	if(CONTROLLER["ArrowRight"] === 1 && CURRENT_INPUT["ArrowRight"] === 0)
	{
		CURRENT_PIECE["left"] += 1;
	}

	// copy over the captured keyboard inputs into the current frame
	for(let key of VALID_CONTROLLER_KEYS)
		CURRENT_INPUT[key] = CONTROLLER[key];

	// move pieces down
	if(
		   FRAME % GRAVITY === 0
		&& FRAME !== 0
		&& CURRENT_PIECE["onFloor"] === false
	)
	{
		CURRENT_PIECE["top"] += 1;
	}

	checkCollision();
	drawActivePiece();
	drawPieceShadow();

	FRAME += 1;
}
setInterval(gameLoop, 1000 / FPS);
