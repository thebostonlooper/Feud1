const fs = require('fs');
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

exports.handler = async (event, context) => {
  const question = getQuestion();
  req.session.score = 0;
  req.session.wrongGuesses = 0;
  req.session.correctAnswers = question.answers;
  res.json({ question: question.question, answers: question.answers.length });
};
