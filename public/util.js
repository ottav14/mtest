import { noteHeadSize, lineThickness } from './params.js';

export const sharpPositions = [-4, -1, -5, -2, 1, -3];
export const flatPositions = [0, -3, 1, -2, 2, -1, 3];
export const keyMap = {
	'a': 3,
	'b': 5,
	'c': 0,
	'd': 2,
	'e': 4,
	'f': 1,
	'aFlat': 4,
	'bFlat': 2,
	'cFlat': 7,
	'dFlat': 5,
	'eFlat': 3,
	'fSharp': 6
}


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


