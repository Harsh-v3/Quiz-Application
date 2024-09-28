const usernameInput = document.querySelector('#usernameInp');
const saveBtn = document.querySelector('#saveHighscore');
const userScore = document.querySelector('#highscoreIs');
const lastUserScore = localStorage.getItem('Highscore');

let usersData = JSON.parse(localStorage.getItem('usersData')) || [];
userScore.innerText = lastUserScore;

saveBtn.addEventListener('click', (e) => {
  if (!usernameInput.value) return;
  e.preventDefault();
  const user = {
    userName: usernameInput.value,
    userScore: lastUserScore,
  };

  usersData.push(user);
  usersData.sort((a, b) => b.userScore - a.userScore);
  localStorage.setItem('usersData', JSON.stringify(usersData));

  // Style Changes :
  saveBtn.value = 'Saved !';
  saveBtn.style.backgroundColor = 'lightgreen';
  saveBtn.setAttribute('disabled', '');
  usernameInput.setAttribute('disabled', '');
});
