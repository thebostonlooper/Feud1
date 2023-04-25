exports.handler = async (event, context) => {
  res.json({ allAnswers: req.session.correctAnswers });
};
