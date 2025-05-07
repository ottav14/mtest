const noteHeadSize = 20
const lineThickness = 5;
const stemThickness = 10;
const stemHeight = 170;
let currentNoteIndex;
let streak = 0;
let longestStreak = 0;
let timeSpent = 0;
let totalTime = 0;
let questionsCompleted = 0;
let modalDisplayed = false;
let optionEnabled = [true, true, true, true];

const validNotes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const optionNames = ['timer', 'streak', 'longestStreak', 'averageTime', 'questionsCompleted'];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const toScreen = (y) => {
	const y0 = canvas.width/2;
	return y*(noteHeadSize+lineThickness) + y0; 
}

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

const drawStaff = () => {
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

const drawNoteHead = (y) => {
	const screenY = toScreen(y);
	ctx.beginPath();
	ctx.ellipse(canvas.width/2, screenY, noteHeadSize, 3 * noteHeadSize / 2, 2 * Math.PI / 6, 0, Math.PI * 2);
	ctx.fillStyle = '#000';
	ctx.fill();
}

const drawNote = (y) => {
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

const drawChord = (notes) => {
	for(const y of notes) {
		drawNote(y);
	}
}

const pickRandomNote = () => {
	let candidate = Math.floor(Math.random() * 11) - 5;
	while(candidate === currentNoteIndex)
		candidate = Math.floor(Math.random() * 11) - 5;
	return candidate;
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

const updateStreak = () => {
	const streakDisplay = document.getElementById('streak');
	streakDisplay.innerText = `Streak: ${streak}`;
}

const updateTimers = () => {
	const timer = document.getElementById('timer');
	timer.innerText = timeSpent.toFixed(2);

	const averageTimeDisplay = document.getElementById('averageTime');
	let averageTime = questionsCompleted ? totalTime / questionsCompleted : 0;
	averageTime = averageTime.toFixed(2);
	averageTimeDisplay.innerText = `Average time: ${averageTime}`;
}

const updateQuestionsCompleted = () => {
	const display = document.getElementById('questionsCompleted');
	display.innerText = `Questions completed: ${questionsCompleted}`;
}

const updateLongestStreak = () => {
	longestStreak = streak;
	const display = document.getElementById('longestStreak');
	display.innerText = `Longest streak: ${longestStreak}`;
}

const handleGuess = (guess) => {
	const button = document.getElementById(`${guess}Button`);
	if(guess === indexToNote(currentNoteIndex)) {
		currentNoteIndex = pickRandomNote();
		renderCall();
		resetButtons();
		questionsCompleted++;
		updateQuestionsCompleted();
		timeSpent = 0;

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
}

const updateCall = () => {
	updateStreak();
	updateLongestStreak();
	updateTimers();
	updateQuestionsCompleted();
}

const renderCall = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawStaff();
	drawNote(currentNoteIndex);
}

const timerInterval = setInterval(() => {
	timeSpent += 0.01;
	totalTime += 0.01;
	updateTimers();
}, 10);

const buttonRefs = getButtonRefs();
currentNoteIndex = pickRandomNote();

const optionRefs = getOptionRefs();

initializeToggles();
updateCall();
renderCall();
