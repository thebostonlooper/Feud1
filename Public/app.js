const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const session = require('express-session');

dotenv.config();
const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'Tucker',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.send('Welcome to Family Feud Game API!');
});

const PORT = process.env.PORT || 5001;

const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

const getQuestion = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % questions.length;
  const question = questions[index];
  return question;
};

const calculateScore = (userAnswer, correctAnswers) => {
  const isCorrect = correctAnswers.some(
    (answer) => answer.toLowerCase() === userAnswer.toLowerCase()
  );
  return isCorrect ? 1 : 0;
};

app.post('/api/start', async (req, res) => {
  const question = getQuestion();
  req.session.score = 0;
  req.session.wrongGuesses = 0;
  req.session.correctAnswers = question.answers;
  res.json({ question: question.question, answers: question.answers.length });
});

app.post('/api/submit-answer', async (req, res) => {
  const userAnswer = req.body.answer;
  const isCorrect = req.session.correctAnswers.some(
    (answer) => answer.toLowerCase() === userAnswer.toLowerCase()
  );

  if (isCorrect) {
    req.session.score += 1;
  } else {
    req.session.wrongGuesses += 1;
  }

  res.json({ isCorrect, score: req.session.score, wrongGuesses: req.session.wrongGuesses, answerIndex });
});

app.get('/api/next-prompt', async (req, res) => {
  const question = getQuestion();
  res.json({ prompt: question.question });
});

app.get("/api/get-all-answers", async (req, res) => {
    res.json({ allAnswers: req.session.correctAnswers });
  });  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const answerInput = document.getElementById('answer');
answerInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter', 'return') {
    event.preventDefault();
    submitAnswer();
  }
});

  // Create new answer element
const answerElement = document.createElement('li');
answerElement.textContent = answerInput.value;

// Add answer element to scoreboard
scoreboard.appendChild(answerElement);

// Remove answer element from scoreboard
scoreboard.removeChild(answerElement);