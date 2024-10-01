'use strict';
// ELEMENTS

const questionEl = document.querySelector('#question');
const questionCounterEl = document.querySelector('#questionCounter');
const scoreCounterEl = document.querySelector('#scoreCounter');
const progressBar = document.querySelector('#progressBar');
const choiceContainer = document.querySelector('.choice-box');
const overlay = document.querySelector('.overlay');
const gamePage = document.querySelector('#GamePage');

// VARIABLES

let currQuestion;
let acceptingAns = false;
let score;
let questionCounter;
let availableQuestion;
let choices;
let answerChoice;

// CONSTANTS

const CORRECT_POINTS = 10;
const WRONG_POINTS = -5;
const MAX_QUESTIONS = 10;
const API = `https://opentdb.com/api.php?amount=${MAX_QUESTIONS}&category=18&difficulty=easy&type=multiple`;

// QUESTIONS ARRAY

let questions = [];

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request Time Out !'));
    }, s * 1000);
  });
};

const load = async function () {
  try {
    const res = await Promise.race([fetch(API), timeout(5)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${res.status} (${data.message})`);

    console.log(data);
    const formatedData = data.results.map((currEl) => {
      const formattedQuestion = {};

      formattedQuestion.question = `${'Q. '.concat(currEl.question)}`;
      const choices = [...currEl.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3 + 1);
      choices.splice(formattedQuestion.answer - 1, 0, currEl.correct_answer);

      choices.forEach((choice, i) => {
        formattedQuestion[`choice${i + 1}`] = choice;
      });

      return formattedQuestion;
    });

    questions.push(...formatedData);
    console.log(questions);

    startGame();
  } catch (err) {
    console.error(err);
  }
};
load();

// FUNCTIONS
const progressBarView = (MQ = MAX_QUESTIONS) => {
  for (let i = 0; i < MQ; i++) {
    const html = `
    <div class="loading-color lg${i + 1} border-radius" style="left: ${
      i * MQ
    }% ; width : ${MQ}%"></div>
    `;
    progressBar.insertAdjacentHTML('beforeend', html);
  }
};
progressBarView();

const progressBarColorView = (answer) => {
  document.querySelector(
    `.lg${MAX_QUESTIONS - availableQuestion.length}`
  ).style.backgroundColor = `${answer ? 'lightgreen' : 'lightcoral'}`;
};

const choiceView = (cQ) => {
  choiceContainer.innerHTML = '';
  const choiceArr = Object.entries(cQ);
  for (const [key, value] of choiceArr) {
    if (key.includes('choice')) {
      const num = key.at(-1);
      console.log(currQuestion.answer == num);
      let html = `
      <div class="choice-container border-radius margin-bottom-small">
            <p class="choice-prefix">${num}</p>
            <p class="choice-text ${
              currQuestion.answer == num ? 'ans' : ''
            }" data-number="${num}"></p>
          </div>
      `;
      choiceContainer.insertAdjacentHTML('beforeend', html);
    }
  }
  return Array.from(document.querySelectorAll('.choice-text'));
};

const startGame = function () {
  score = 0;
  questionCounter = 0;
  availableQuestion = [...questions];
  overlay.classList.add('hidden');
  gamePage.classList.remove('hidden');
  getNewQuestion();
};

const gameMode = () => {
  choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
      if (!acceptingAns) return;

      acceptingAns = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset['number'];

      const ClassToApply =
        +selectedAnswer === currQuestion.answer ? 'correct' : 'incorrect';

      if (ClassToApply === 'correct') {
        score += CORRECT_POINTS;
        progressBarColorView(true);
      } else {
        score += WRONG_POINTS;
        answerChoice.style.backgroundColor = '#cff99c99';
        progressBarColorView(false);
      }

      selectedChoice.parentElement.classList.add(ClassToApply);

      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(ClassToApply);
        scoreCounterEl.innerText = score;
        getNewQuestion();
      }, 2000);
    });
  });
};

const getNewQuestion = function () {
  if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('Highscore', score);
    return window.location.assign('End/end.html');
  }
  questionCounter++;
  questionCounterEl.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
  let currQuestionNum = Math.floor(Math.random() * availableQuestion.length);
  currQuestion = availableQuestion[currQuestionNum];
  questionEl.innerText = currQuestion.question;
  choices = choiceView(currQuestion);

  choices.forEach((choice) => {
    const num = choice.dataset['number'];
    choice.innerText = currQuestion['choice' + num];
  });

  answerChoice = document.querySelector('.ans');
  availableQuestion.splice(currQuestionNum, 1);
  acceptingAns = true;

  gameMode();
};
