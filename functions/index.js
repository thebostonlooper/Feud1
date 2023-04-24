const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const session = require('express-session');

dotenv.config();

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

app.get('/api/start', async (req, res) => {
  const question = getQuestion();
  req.session.score = 0;
  req.session.wrongGuesses = 0;
  req.session.correctAnswers = question.answers;
  res.json({ question: question.question, answers: question.answers.length });
});

app.post('/api/submit-answer', async (req, res) => {
    const userAnswer = req.body.answer;
    const isCorrect = req.session.correctAnswers.some(
      (answer, index) => {
        const found = answer.toLowerCase() === userAnswer.toLowerCase();
        if (found) {
          req.session.answerIndex = index;
        }
        return found;
      }
    );
  
    if (isCorrect) {
      req.session.score += 1;
    } else {
      req.session.wrongGuesses += 1;
    }
  
    res.json({
      isCorrect,
      score: req.session.score,
      wrongGuesses: req.session.wrongGuesses,
      answerIndex: req.session.answerIndex,
      correctAnswer: isCorrect ? req.session.correctAnswers[req.session.answerIndex] : null,
      totalAnswers: req.session.correctAnswers.length // Add this line
    });
  });  

app.get('/api/next-prompt', async (req, res) => {
  const question = getQuestion();
  res.json({ prompt: question.question });
});

app.get("/api/get-all-answers", async (req, res) => {
    res.json({ allAnswers: req.session.correctAnswers });
  });  