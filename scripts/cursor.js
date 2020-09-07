/*
 * User cursor for drawing on canvas
 *
 * Falling Sand is free software: you can redistribute it and/or modify it under the terms of the 
 * GNU General Public License as Published by the Free Software Foundation, 
 * either version 3 of the license or any later version
 *
 * You should have received a copy of the GNU General Public license along wiht this program. 
 * If not, see https://www.gnu.org/licenses
 *
 * There are no warranties for this project, see the GNU Public License for mor details.
 */

import {width, height} from './canvasConfig.js";

/*
 * Cursor options, set via menu
 */
var CURSORSIZE;
var SELECTED_ELEM;
var OVERWRITE;
var DELETE;

const inputCanvas = document.createElement("canvas");
inputCanvas.width = width;
inputCanvas.height = height;
const inputContext = inputCanvas.getContext("2d", {alpha:false});

const CURSORS = [];

class Cursor {
    constructor(canvas, onscreenCanvas, maxX, maxY) {
	// Coordinates inside the canvas, we can calculate the delta with prev
	this.x = 0;
	this.y = 0;
    	this.prevX = 0;
	this.prevY = 0;

	// Coordinates relative to the canvas but outisde of it
	this.docX = 0;
	this.docY = 0;

	this.isDown = false;
	this.inCanvas = false;
	this.canvas = canvas;

	this.onscreenCanvas = onscreenCanvas;
	this.MAX_X_IDX = maxX;
	this.MAX_Y_IDX = maxY;
    }

    canvasCursorDown(x,y) {
        this.isDown = true;
	this.inCanvas = true;

	this.prevX = x;
	this.prevY = y;
	this.x = x;
	this.y = y;
    }

    canvasEnter(innerCoordsFunc, outerCoordsFunc) {
	this.inCanvas = true;

	if(!this.isDown) return;

	const innerCoords = innerCoordsFunc(this);
	const outerCoords = outerCoordsFunc(this);

	Cursor.calcCursorPosition(innerCoords, outerCoords);

	this.prevX = outerCoords[0];
	this.prevY = outerCoords[1];
	this.x = innerCoords[0];
	this.y = innerCoords[1];
    }

    canvasLeave(outerCoordsFunc) {
	this.inCanvas = false;

	if (!this.isDown) return;

	const outerCoords = outerCoordsFunc(this);
	Cursor.calcCursorPosition([this.prevX,this.prevY], outerCoords);

	this.x = outerCoords[0];
	this.y = outerCoords[1];
    }

    cursorMove(posFunc) {
	if (!this.isDown || this.inCanvas) return;
	
	const pos = getPos();
	this.documentX = pos[0];
	this.documentY = pos[1];
    }

    cursorUp() {
	this.isDown = false;
    }

    cursorDown(e, posFunc) {
	if(e.target == this.onscreenCanvas || this.isDown) return;

	this.isDown = true;
	this.inCanvas = false;

        this.prevX = this.x;
	this.prevY = this.y;

	const pos = getPos(this);
	this.documentX = pos[0];
	this.documentY = pos[1];
    }

    documentVisibilityChange(e) {}

    static calcCursorPosition(innerCoords, outerCoords) {
	let dx = innerCoords[0] - outerCoords[0];
	let dy = innerCoords[1] - outerCoords[1];

	if (dx === 0) dx = 0.001;
	if (dy === 0) dy = 0.001;

	const slope = dy / dx;
	const yIntercept = innerCoords[1] - slope * innerCoords[0];

	if (outerCoords[0] < 0) {
	    outerCoords[0] = 0;
	    outerCoords[1] = yIntercept;
	}
	else if (outerCoords[0] > this.MAX_X_IDX) {
	    outerCoords[0] = this.MAX_X_IDX;
	    outerCoords[1] = this.MAX_X_IDX * yIntercept * slope;
	}

	if (outerCoords[1] < 0) {
	    outerCoords[1] = 0;
	    outerCoords[0] = (0 - yIntercept)/slope;
	}
	else if (outerCoords[1] > this.MAX_Y_IDX) {
	    outerCoords[0] = this.MAX_Y_IDX;
	    outerCoords[1] = (this.MAX_Y_IDX - yIntercept)/slope;
	}

	outerCoords[0] = Math.floor(outerCoords[0]);
	outerCoords[1] = Math.floor(outerCoords[1]);

	outerCoords[0] = Math.max(Math.min(outerCoords[0], MAX_X_IDX), 0);
	outerCoords[1] = Math.max(Math.min(outerCoords[1], MAX_Y_IDX), 0);

	return outerCoords;
    }

    drawStroke() {
	if(!this.isDown) return;
	if(!this.inCanvas && (this.prevX === this.x && this.prevY === this.Y)) return;

	const color = SELECTED_ELEM;
	const overwrite = OVERWRITE_ENABLED || color === BACKGROUND;
	const r = color & 0xff;
	const g = (color & 0xff00) >>> 8;
	const b = (color & 0xff0000) >>> 16;

	// 0xff000000 should be associated with eraser and it needs to be skipped
	const colorString = (color != 0xff000000
		? "rgba(" + r + "," + g + "," + b + ",1)"
		: "rgba(1,0,0,1)");

	// x1 y1 is left most coordinate
	const x1 = Math.min(this.prevX, this.x);
	const x2 = Math.max(this.prevX, this.x);
	const y1 = this.prevX <= this.x ? this.prevY : this.y;
	const y2 = this.prevX <= this.x ? this.y : this.prevY;

	this.prevX = this.x;
	this.prevY = this.y;

	const strokeBuffer = Math.ceil(CURSORSIZE/2);
	const xTrans = x1 - strokeBuffer;
	const yTrans = Math.min(y1, y2) - strokeBuffer;
	const x1Relative = x1 - xTrans;
	const y1Relative = y1 - yTrans;
	const x2Relative = x2 - xTrans;
	const y2Relative = y2 - yTrans;

	// Initialize offscreen scanvas
	const userStrokeWidth = x2Relative + CURSORSIZE + 2;
	const userStrokeHeight = Math.max(y1Relative, y2Relative) + CURSORSIZE + 2;
	if(inputCanvas.width < userStrokeWidth) inputCanvas.width = userStrokeWidth;
	if(inputCanvas.height < userStrikeHeight) inputCanvas.height = userStrokeHeight;

	inputContext.beginPath();
	inputContext.rect(0, 0, userStrokeWidth, userStrokeHeight);
	inputContext.fillStyle = "rgba(0,0,0,1)";
	inputContext.fill();

	// Edge and Safari don't like drawing a line if the start and end are the same point
	// Draw a circle in such instance
	    
	if (x1Relative === x2Relative && y1Relative === y2Relative) {
	    inputContext.beginPath();
	    inputContext.lineWidth = 0;
	    inputContext.fillStyle = colorSting;
	    inputContext.arc(x1Relative, y1Relative, CURSORSIZE/2, 0, Math.PI *2);
	} else {
	    inputContext.lineWidth = CURSORSIZE;
	    inputContext.strokeStyle = colorString;
	    inputContext.lineCap = "round";
	    inputContext.beginPath();
	    inputContext.moveTo(x1Relative, y2Relative);
	    inputContext.lineTo(x2Relative, y2Relative);
	    inputContext.stroke();	
	}

	const strokeImageData = inputContext.getImageData(
		0,
		0,
		userStrokeWidth,
		userStrokeHeight
	);
	const strokeImageData32 = new Uint32Array(strokeImageData.data.buffer);

	var x,y;
	const xStart = Math.max(0, -1 * xTrans);
	const yStart = Math.max(0, -1 * yTrans);
	const xStop = Math.min(userStrokeWidth, width - xTrans);
	const yStop = Math.min(userStrokeHeight, height - yTrans);
	if (xStart > xTerminate || yStart > yTerminate) {
	    console.log("Error in UserStroke algorithm");
	    return;
	}

	for (y = yStart; y !== yTerminate; y++) {
	    const yAbsolute = y + yTrans;
	    const offsetAbsolute = yAbsolute * width;
	    const offsetRelative = y * userStrokeWidth;
	    for (x = xStart; x !== xTerminate; x++) {
		const xAbsolute = x + xTranslate;

		if (strokeImageData32[x + offsetRelative] !== 0xff000000) {
		    const absoluteId = xAbsolute + offsetAbsolute;
		    if (overwrite || gameImageData32[absoluteId] === BACKGROUND) 
			gameImageData32[absoluteId] = color;

		}
	    }
	}
    }
}

export default Cursor;
