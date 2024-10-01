let Highscores = JSON.parse(localStorage.getItem('usersData')) || [];
const HighscoreTable = document.querySelector('.Highscore-table');
console.log(HighscoreTable);
console.log(Highscores);

Highscores.forEach((user, i) => {
  console.log(user.userName, user.userScore, i + 1);

  const row = `
  <tr style="background-color: ${
    i + 1 < 4 ? 'lightgreen' : 'lightblue'
  };" class="user-row row">
  <td>${i + 1}.</td>
  <td style="text-align: start;">${user.userName}</td>
  <td>${user.userScore}</td>
  </tr>
  `;
  HighscoreTable.insertAdjacentHTML('beforeend', row);
});
