const apiUrl = "https://opentdb.com/api.php?amount=1&type=multiple";

let currentPlayer = 1;
let playerCount = 1;
let score = Array(playerCount).fill(0);

document.getElementById("app").addEventListener("click", (event) => {
  if (event.target.id === "startButton") {
    startGame();
  } else if (event.target.tagName === "LI") {
    checkAnswer(event);
  }
});

async function startGame() {
  playerCount = parseInt(document.getElementById("playerCount").value);
  score = Array(playerCount).fill(0);
  currentPlayer = 1;
  document.getElementById("gameContainer").innerHTML = "";
  document.getElementById("scoreContainer").innerHTML = "";
  updateScoreDisplay();
  await playTurn();
}

async function playTurn() {
  try {
    const question = await getTriviaQuestion();
    if (question) {
      displayQuestion(question);

      const selectedOption = await getUserAnswer();

      if (checkAnswer(question, selectedOption)) {
        alert("Correct!");
        updateScore();

        if (checkWinCondition()) {
          alert(`Player ${currentPlayer} wins!`);
          startGame();
          return;
        }
      } else {
        alert("Incorrect! Next player's turn.");
        nextPlayer();
      }

      playTurn();
    } else {
      alert("No hay preguntas disponibles. Inténtalo de nuevo más tarde.");
      playTurn();
    }
  } catch (error) {
    console.error("Error in playTurn:", error);
  }
}

function getTriviaQuestion() {
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data.results[0]);
}

function displayQuestion(question) {
  const gameContainer = document.getElementById("gameContainer");
  const questionElement = document.createElement("div");
  questionElement.innerHTML = `
    <h2>Category: ${question.category}</h2>
    <p>${question.question}</p>
    <ul>
      ${shuffleOptions([...question.incorrect_answers, question.correct_answer])
        .map((option) => `<li>${option}</li>`)
        .join("")}
    </ul>
  `;
  gameContainer.appendChild(questionElement);
}

function getUserAnswer() {
  return new Promise((resolve) => {
    const options = document.querySelectorAll("#gameContainer li");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        resolve(option.innerText);
      });
    });
  });
}

function checkAnswer(question, selectedOption) {
  return selectedOption === question.correct_answer;
}

function updateScore() {
  score[currentPlayer - 1]++;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  const scoreContainer = document.getElementById("scoreContainer");
  scoreContainer.innerHTML = "";
  for (let i = 1; i <= playerCount; i++) {
    const playerScore = document.createElement("div");
    playerScore.innerHTML = `Player ${i}: ${score[i - 1]} points`;
    scoreContainer.appendChild(playerScore);
  }
}

function nextPlayer() {
  currentPlayer = (currentPlayer % playerCount) + 1;
  document.getElementById("gameContainer").innerHTML = "";
}

function checkWinCondition() {
  return score[currentPlayer - 1] === 10;
}

function shuffleOptions(options) {
  return options.sort(() => Math.random() - 0.5);
}
