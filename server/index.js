require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users');
const livesRouter = require('./routes/lives');
const scoresRouter = require('./routes/scores');
const leaderboardRouter = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/users', livesRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/leaderboard', leaderboardRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
