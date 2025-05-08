import { noteHeadSize, lineThickness } from './params.js';

const mod = (n, m) => {
	return ((n % m) + m) % m;
}

export const toScreen = (y) => {
	const y0 = canvas.width/2;
	return y*(noteHeadSize+lineThickness) + y0; 
}

export const indexToNote = (ix) => {
	const table = ['b', 'a', 'g', 'f', 'e', 'd', 'c'];
	return table[mod(ix, 7)];
}


