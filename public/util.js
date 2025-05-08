import { noteHeadSize, lineThickness } from './params.js';

export const toScreen = (y) => {
	const y0 = canvas.width/2;
	return y*(noteHeadSize+lineThickness) + y0; 
}

