import { drawStaff, drawNoteHead, drawNote, drawChord, clearCanvas } from './render.js';
import { updateStreak, updateTimers, updateQuestionsCompleted, updateLongestStreak, updateAccuracy } from './optionUpdaters.js';
import * as PARAMS from './params.js';

let currentNoteIndex;
let mode;

let optionEnabled = [true, true, true, true];
let currentChord = [];
let currentChordGuess = [];

const validNotes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const optionNames = ['timer', 'streak', 'longestStreak', 'averageTime', 'questionsCompleted', 'accuracy'];
const modes = ['note', 'chord'];

const mod = (n, m) => {
	return ((n % m) + m) % m;
}

const indexToNote = (ix) => {
	const table = ['b', 'a', 'g', 'f', 'e', 'd', 'c'];
	return table[mod(ix, 7)];
}

const initializeToggles = () => {
	for(let i=0; i<optionNames.length; i++) {
		const name = optionNames[i];
		const toggle = document.getElementById(`${name}Toggle`);
		toggle.checked = true;
		toggle.addEventListener('change', () => {
			optionEnabled[i] = toggle.checked;
			if(toggle.checked)
				optionRefs[i].classList.remove('hidden');
			else
				optionRefs[i].classList.add('hidden');
		});
	}
}

const pickRandomNote = (previous) => {
	let candidate = Math.floor(Math.random() * 11) - 5;
	while(candidate === previous)
		candidate = Math.floor(Math.random() * 11) - 5;
	return candidate;
}

const pickRandomChord = (previous) => {
	currentNoteIndex = pickRandomNote(previous);
	const root = currentNoteIndex;
	return [root, root+2, root+4];
}

const getButtonRefs = () => {
	const buttonRefs = [];
	for(const note of validNotes) {
		buttonRefs.push(document.getElementById(`${note}Button`));
		buttonRefs.at(-1).addEventListener('click', () => handleGuess(note));
	}
	return buttonRefs;
}

const getOptionRefs = () => {
	const optionRefs = [];
	for(const name of optionNames) {
		optionRefs.push(document.getElementById(name));
	}
	return optionRefs;
}

const resetButtons = () => {
	for(const button of buttonRefs) {
		button.classList.add('btn-secondary');
		button.classList.remove('btn-danger');
	}
}

const handleGuess = (guess) => {
	const button = document.getElementById(`${guess}Button`);
	switch(mode) {
		case 'note':
			if(guess === indexToNote(currentNoteIndex)) {
				currentNoteIndex = pickRandomNote(currentNoteIndex);
				renderCall();
				resetButtons();
				questionsCompleted++;
				updateQuestionsCompleted();
				PARAMS.setTimeSpent(0);

				streak++;
				if(streak > longestStreak)
					updateLongestStreak();

				button.classList.add('btn-secondary');
				button.classList.remove('btn-danger');
			}
			else {
				button.classList.add('btn-danger');
				button.classList.remove('btn-secondary');
				streak = 0;
			}
			updateStreak();
			PARAMS.setGuesses(PARAMS.getGuesses()+1);
			updateAccuracy();
			break;
		case 'chord':

			break;
	}
}

const updateCall = () => {
	updateStreak();
	updateLongestStreak();
	updateTimers();
	updateQuestionsCompleted();
	updateAccuracy();
}

const renderCall = () => {
	clearCanvas();
	drawStaff();

	if(mode === 'note')
		drawNote(currentNoteIndex);
	else if(mode === 'chord')
		drawChord(currentChord);
}


const timerInterval = setInterval(() => {
	PARAMS.setTimeSpent(PARAMS.getTimeSpent()+0.01);
	PARAMS.setTotalTime(PARAMS.getTotalTime()+0.01);
	updateTimers();
}, 10);

const modeDropdown = document.getElementById('dropdown');
modeDropdown.addEventListener('change', () => {
	mode = modes[modeDropdown.value-1];
	switch(mode) {
		case 'note':
			currentNoteIndex = pickRandomNote(currentNoteIndex);
			break;
		case 'chord':
			currentChord = pickRandomChord(currentNoteIndex);
			break;
	}
	renderCall();
});
mode = modes[modeDropdown.value-1];

const buttonRefs = getButtonRefs();

if(mode === 'note')
	currentNoteIndex = pickRandomNote(currentNoteIndex);
else if(mode === 'chord')
	currentChord = pickRandomChord(currentNoteIndex);

const optionRefs = getOptionRefs();

initializeToggles();
updateCall();
renderCall();
