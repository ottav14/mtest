import * as PARAMS from './params.js';
import * as UTIL from './util.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const drawLine = (x1, y1, x2, y2) => {
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

export const drawStaff = () => {
	const y0 = canvas.width/2 - 4*(PARAMS.noteHeadSize+PARAMS.lineThickness);
	for(let i=0; i<5; i++) {
		const y = 2*i*(PARAMS.noteHeadSize+PARAMS.lineThickness) + y0;
		ctx.strokeStyle = '#000';
		ctx.lineWidth = PARAMS.lineThickness;
		drawLine(0, y, canvas.width, y);
	}
}

export const drawNoteHead = (y) => {
	const screenY = UTIL.toScreen(y);
	ctx.beginPath();
	ctx.ellipse(canvas.width/2, screenY, PARAMS.noteHeadSize, 3 * PARAMS.noteHeadSize / 2, 2 * Math.PI / 6, 0, Math.PI * 2);
	ctx.fillStyle = '#000';
	ctx.fill();
}

export const drawNote = (y) => {
	const screenY = UTIL.toScreen(y)-3;
	const screenX = canvas.width/2 + PARAMS.noteHeadSize + 2.5;
	drawNoteHead(y);
	ctx.lineWidth = PARAMS.stemThickness;
	drawLine(screenX, screenY, screenX, screenY-PARAMS.stemHeight);

	if(y <= -6 || y >= 6) { 
		const parity = y < 0 ? -1 : 1;
		const ledgerCount = Math.floor((y - parity*4)/(parity*2));
		const y0 = canvas.width/2 + parity*6*(PARAMS.noteHeadSize+PARAMS.lineThickness);
		for(let i=0; i<ledgerCount; i++) {
			const y = y0 + parity*2*i*(PARAMS.noteHeadSize+PARAMS.lineThickness);
			const mid = canvas.width/2;
			const ledgerWidth = 80;
			ctx.lineWidth = PARAMS.lineThickness;
			drawLine(mid+ledgerWidth/2, y, mid-ledgerWidth/2, y);
		}
	}
}

export const drawChord = (notes) => {
	for(const y of notes) {
		drawNote(y);
	}
}

export const clearCanvas = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
