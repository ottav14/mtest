import { drawStaff, drawNoteHead, drawNote, drawChord, clearCanvas } from './render.js';
import { updateStreak, updateTimers, updateQuestionsCompleted, updateLongestStreak, updateAccuracy } from './optionUpdaters.js';
import { indexToNote } from './util.js';
import * as PARAMS from './params.js';

let currentNoteIndex = 0;
let mode;

let optionEnabled = [true, true, true, true];
let currentChord;
let currentChordIndices;
let currentChordGuess = new Set();

const validNotes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const optionNames = ['timer', 'streak', 'longestStreak', 'averageTime', 'questionsCompleted', 'accuracy'];
const modes = ['note', 'chord'];

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
	let candidate = Math.floor(Math.random() * 4);
	while(candidate === previous)
		candidate = Math.floor(Math.random() * 4);
	currentNoteIndex = candidate;
	const root = candidate;
	currentChordIndices = [root, root-2, root-4];
	currentChord = new Set([indexToNote(root), indexToNote(root-2), indexToNote(root-4)]);
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
		button.classList.remove('btn-primary');
		button.classList.remove('btn-danger');
		button.disabled = false;
	}
}

const resetOptions = () => {
	PARAMS.setStreak(0);
	PARAMS.setLongestStreak(0);
	PARAMS.setTimeSpent(0);
	PARAMS.setTotalTime(0);
	PARAMS.setQuestionsCompleted(0);
	PARAMS.setGuesses(0);
	PARAMS.setAccuracy(1);

	updateCall();
}

const handleGuess = (guess) => {
	const button = document.getElementById(`${guess}Button`);
	switch(mode) {
		case 'note':
			if(guess === indexToNote(currentNoteIndex)) {
				currentNoteIndex = pickRandomNote(currentNoteIndex);
				renderCall();
				resetButtons();
				PARAMS.setQuestionsCompleted(PARAMS.getQuestionsCompleted()+1);
				updateQuestionsCompleted();
				PARAMS.setTimeSpent(0);

				const currentStreak = PARAMS.getStreak();
				PARAMS.setStreak(currentStreak+1);
				if(currentStreak+1 > PARAMS.getLongestStreak())
					updateLongestStreak();

				button.classList.add('btn-secondary');
				button.classList.remove('btn-danger');
			}
			else {
				button.classList.add('btn-danger');
				button.classList.remove('btn-secondary');
				button.disabled = true;
				PARAMS.setStreak(0);
			}
			break;
		case 'chord':
			if(currentChord.has(guess)) {
				button.classList.add('btn-primary');
				button.classList.remove('btn-secondary');

				currentChordGuess.add(guess);

				const currentStreak = PARAMS.getStreak();
				PARAMS.setStreak(currentStreak+1);
				if(currentStreak+1 > PARAMS.getLongestStreak())
					updateLongestStreak();

				PARAMS.setQuestionsCompleted(PARAMS.getQuestionsCompleted()+1);
				updateQuestionsCompleted();
				
				if(currentChord.size === currentChordGuess.size && [...currentChord].every(x => currentChordGuess.has(x))) {
					resetButtons();
					currentChordGuess = new Set();
					pickRandomChord(currentNoteIndex);
					updateStreak();

					renderCall();
					break;
				}
			}
			else {
				button.classList.add('btn-danger');
				button.classList.remove('btn-secondary');

				PARAMS.setStreak(0);
			}

			button.disabled = true;
			break;
	}
	updateStreak();
	PARAMS.setGuesses(PARAMS.getGuesses()+1);
	updateAccuracy();
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
		drawChord(currentChordIndices);
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
			pickRandomChord(currentNoteIndex);
			break;
	}
	renderCall();
	resetButtons();
	resetOptions();
});
mode = modes[modeDropdown.value-1];

const buttonRefs = getButtonRefs();

if(mode === 'note')
	currentNoteIndex = pickRandomNote(currentNoteIndex);
else if(mode === 'chord')
	pickRandomChord(currentNoteIndex);

const optionRefs = getOptionRefs();

initializeToggles();
updateCall();
renderCall();
