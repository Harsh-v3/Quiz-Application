// ELEMENTS

const questionEl = document.querySelector('#question');
const questionCounterEl = document.querySelector('#questionCounter');
const scoreCounterEl = document.querySelector('#scoreCounter');
const progressBar = document.querySelector('#progressBar');
const choiceContainer = document.querySelector('.choice-box');

// VARIABLES

let currQuestion;
let acceptingAns = false;
let score;
let questionCounter;
let availableQuestion;
let choices;

// QUESTIONS ARRAY

let questions = [
  {
    question: 'Q. Inside which HTML element do we put the JavaScript??',
    choice1: '<script>',
    choice2: '<javascript>',
    choice3: '<js>',
    choice4: '<scripting>',
    answer: 1,
  },
  {
    question:
      "Q. What is the correct syntax for referring to an external script called 'xxx.js'?",
    choice1: `<script href='xxx.js'>`,
    choice2: `<script name='xxx.js'>`,
    choice3: `<script src='xxx.js'>`,
    choice4: `<script file='xxx.js'>`,
    answer: 3,
  },
  {
    question: "Q. How do you write 'Hello World' in an alert box?",
    choice1: "msgBox('Hello World');",
    choice2: "alertBox('Hello World');",
    choice3: "msg('Hello World');",
    choice4: "alert('Hello World');",
    answer: 4,
  },
  {
    question: 'Q. Which Language is used to structure the Web Page ?',
    choice1: 'HTML',
    choice2: 'CSS',
    choice3: 'MongoDB',
    choice4: 'PHP',
    answer: 1,
  },
];

// CONSTANTS

const CORRECT_POINTS = 10;
const WRONG_POINTS = -5;
const MAX_QUESTIONS = questions.length;

// FUNCTIONS
const progressBarView = (MQ = MAX_QUESTIONS) => {
  for (i = 0; i < MQ; i++) {
    const html = `
    <div class="loading-color lg${i + 1} border-radius" style="left: ${
      i * 25
    }%"></div>
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

      let html = `
      <div class="choice-container border-radius margin-bottom-small">
            <p class="choice-prefix">${num}</p>
            <p class="choice-text" data-number="${num}"></p>
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
  getNewQuestion();
};

const gameMode = () => {
  choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
      console.log(acceptingAns);
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
        progressBarColorView(false);
      }

      selectedChoice.parentElement.classList.add(ClassToApply);

      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(ClassToApply);
        scoreCounterEl.innerText = score;
        getNewQuestion();
      }, 1000);
    });
  });
};

const getNewQuestion = function () {
  if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTIONS) {
    return window.location.assign('../end.html');
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

  availableQuestion.splice(currQuestionNum, 1);
  acceptingAns = true;

  gameMode();
};

const incrementScore = (points) => {
  score += points;
};
startGame();
