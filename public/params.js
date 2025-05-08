export const noteHeadSize = 20
export const lineThickness = 5;
export const stemThickness = 10;
export const stemHeight = 170;

let streak = 0;
let longestStreak = 0;
let timeSpent = 0;
let totalTime = 0;
let questionsCompleted = 0;
let guesses = 0;
let accuracy = 1;

export const getStreak = () => streak;
export const setStreak = (x) => {streak=x};

export const getLongestStreak = () => longestStreak;
export const setLongestStreak = (x) => {longestStreak=x};

export const getTimeSpent = () => timeSpent;
export const setTimeSpent = (x) => {timeSpent=x};

export const getTotalTime = () => totalTime;
export const setTotalTime = (x) => {totalTime=x};

export const getQuestionsCompleted = () => questionsCompleted;
export const setQuestionsCompleted = (x) => {questionsCompleted=x};

export const getGuesses = () => guesses;
export const setGuesses = (x) => {guesses=x};

export const getAccuracy = () => accuracy;
export const setAccuracy = (x) => {accuracy=x};

