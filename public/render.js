import { noteHeadSize, lineThickness, stemThickness, stemHeight } from './params.js';
import { toScreen, indexToNote } from './util.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

export const drawStaff = () => {
	ctx.beginPath();
	ctx.strokeStyle = '#000';
	ctx.lineWidth = lineThickness;
	const y0 = canvas.width/2 - 4*(noteHeadSize+lineThickness);
	for(let i=0; i<5; i++) {
		const y = 2*i*(noteHeadSize+lineThickness) + y0;
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
	}
}

export const drawNoteHead = (y) => {
	const screenY = toScreen(y);
	ctx.beginPath();
	ctx.ellipse(canvas.width/2, screenY, noteHeadSize, 3 * noteHeadSize / 2, 2 * Math.PI / 6, 0, Math.PI * 2);
	ctx.fillStyle = '#000';
	ctx.fill();
}

export const drawNote = (y) => {
	const screenY = toScreen(y)-3;
	const screenX = canvas.width/2 + noteHeadSize + 2.5;
	drawNoteHead(y);
	ctx.beginPath();
	ctx.strokeStyle = '#000';
	ctx.lineWidth = stemThickness;
	ctx.moveTo(screenX, screenY);
	ctx.lineTo(screenX, screenY-stemHeight);
	ctx.stroke();
}

export const drawChord = (notes) => {
	for(const y of notes) {
		drawNote(y);
	}
}

export const clearCanvas = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
