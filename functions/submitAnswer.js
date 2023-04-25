exports.handler = async (event, context) => {
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
};
