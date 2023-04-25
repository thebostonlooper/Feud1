const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
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
  res.send('Welcome to Family Feud Game!'); // Modified the message
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

