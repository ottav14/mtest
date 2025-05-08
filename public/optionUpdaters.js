import * as PARAMS from './params.js';

export const updateStreak = () => {
	const display = document.getElementById('streak');
	const streak = PARAMS.getStreak();
	display.innerText = `Streak: ${streak}`;
}

export const updateTimers = () => {
	const timerDisplay = document.getElementById('timer');
	timerDisplay.innerText = PARAMS.getTimeSpent().toFixed(2);

	const averageTimeDisplay = document.getElementById('averageTime');
	const questionsCompleted = PARAMS.getQuestionsCompleted();
	const totalTime = PARAMS.getTotalTime();
	let averageTime = questionsCompleted ? totalTime / questionsCompleted : 0;
	averageTime = averageTime.toFixed(2);
	averageTimeDisplay.innerText = `Average time: ${averageTime}`;
}

export const updateQuestionsCompleted = () => {
	const display = document.getElementById('questionsCompleted');
	const questionsCompleted = PARAMS.getQuestionsCompleted();
	display.innerText = `Questions completed: ${questionsCompleted}`;
}

export const updateLongestStreak = () => {
	const longestStreak = PARAMS.getLongestStreak();
	const streak = PARAMS.getStreak();
	const display = document.getElementById('longestStreak');
	PARAMS.setLongestStreak(Math.max(longestStreak, streak));
	display.innerText = `Longest streak: ${PARAMS.getLongestStreak()}`;
}

export const updateAccuracy = () => {
	const guesses = PARAMS.getGuesses();
	const questionsCompleted = PARAMS.getQuestionsCompleted();
	if(!guesses)
		PARAMS.setAccuracy(Number(1).toFixed(2));
	else
		PARAMS.setAccuracy((questionsCompleted / guesses).toFixed(2));

	const display = document.getElementById('accuracy');
	const accuracy = PARAMS.getAccuracy();
	display.innerText = `Accuracy: ${accuracy}`;
}

