let currentPrompt;
let wrongGuesses = 0;

function startGame() {
    console.log("Start game button clicked"); // Add this line
    //fetch("/api/start")
    fetch("/.netlify/functions/start")
      .then((response) => response.json())
      .then((data) => {
        currentPrompt = data;
        document.getElementById("question").innerHTML = currentPrompt.question;
        createScoreboardBoxes(currentPrompt.answers);
        document.getElementById("welcome").style.display = "none";
        document.getElementById("game").style.display = "block";
      });
  }
  

  function createScoreboardBoxes(numberOfAnswers) {
    const scoreboard = document.getElementById("dynamicScoreboard");
  
    // Remove any existing boxes from the scoreboard
    while (scoreboard.firstChild) {
      scoreboard.removeChild(scoreboard.firstChild);
    }
  
    // Create the new boxes based on the number of answers
    for (let i = 0; i < numberOfAnswers; i++) {
      const box = document.createElement("div");
      box.setAttribute("id", "box" + (i + 1));
      box.setAttribute("data-number", i + 1);
      box.classList.add("box");
      box.classList.add("empty");
      box.innerHTML = i + 1;
      scoreboard.appendChild(box);
    }
  }  

  const showPopup = (content, isCorrect = true) => {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popup-content");
  
    if (!isCorrect) {
      content = `<span class="red-x">&times;</span><br>Incorrect`;
    }
    popupContent.innerHTML = content;
    popup.classList.remove("hidden");
    function revealCorrectAnswer(answerIndex) {
        let box = document.getElementById("box" + (answerIndex + 1));
        box.innerHTML = currentPrompt.answers[answerIndex];
        box.classList.remove("empty");
        box.classList.add("correct-answer"); // Add this line
      }      
  
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 3000);
  };  

  const endGame = async (score) => {
    if (score === currentPrompt.answers.length) {
      document.getElementById('perfect-game').style.display = 'block';
    } else {
      document.getElementById('perfect-game').style.display = 'none';
    }
    
    document.getElementById('answer').style.display = 'none';
    document.getElementById('submitAnswerButton').style.display = 'none';

    document.getElementById('results').style.display = 'block';
    document.getElementById('score').innerText = `Your final score: ${score}`;

    document.getElementById('results').style.display = 'block';
    document.getElementById('score').innerText = `Your final score: ${score}`;
  
    //const response = await fetch('/api/get-all-answers');
    const response = await fetch('/.netlify/functions/getAllAnswers');
    const data = await response.json();
  
    data.allAnswers.forEach((answer, index) => {
      const box = document.getElementById(`box${index + 1}`);
      box.innerHTML = answer;
      if (!box.classList.contains("correct")) {
        box.classList.add("wrong-answer");
      }
    });
  };   
  
  async function submitAnswer() {
    const answer = answerInput.value.trim();
    if (answer === '') return;
  
    //const response = await fetch('/api/submit-answer', {
    const response = await fetch('/.netlify/functions/submitAnswer', {    
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answer })
    });
  
    const data = await response.json();
    answerInput.value = '';
  
    const answerIndex = data.answerIndex;
    const isCorrect = data.isCorrect;
    const score = data.score;
    const totalAnswers = data.totalAnswers;
  
    if (isCorrect) {
      const box = document.getElementById(`box${answerIndex + 1}`);
      box.textContent = answer;
      box.classList.add("correct");
    } else {
      showPopup("Incorrect", false);
      wrongGuesses += 1;
      displayRedXs(wrongGuesses);
    }
  
    if (wrongGuesses >= 3 || score === totalAnswers) {
      endGame(score);
      return;
    }
  }  

function displayRedXs(numberOfXs) {
  const redXContainer = document.getElementById('red-x-container');
  redXContainer.innerHTML = '';

  for (let i = 0; i < numberOfXs; i++) {
    const redX = document.createElement('span');
    redX.classList.add('red-x');
    redX.innerHTML = 'X';
    redXContainer.appendChild(redX);
  }
} 

const answerInput = document.getElementById("answer");
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitAnswer();
  }
});

function toggleInstructions() {
    const instructionsModal = document.getElementById("instructions-modal");
    instructionsModal.classList.toggle("hidden");
  }  

const startGameButton = document.getElementById("startGameButton");
startGameButton.addEventListener("click", startGame);
