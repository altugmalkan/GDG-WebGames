const express = require('express');
const router = express.Router();
const pool = require('../db');

const GAMES = ['card_match', 'code_breaker', 'bug_hunt', 'sort_race', 'quiz'];

const MAX_SCORES = {
  card_match: 1130,
  code_breaker: 1000,
  bug_hunt: 1000,
  sort_race: 700,
  quiz: 800,
};

// POST /api/scores — Save a score
router.post('/', async (req, res) => {
  const { user_id, game, score } = req.body;

  if (!user_id || !game || score === undefined) {
    return res.status(400).json({ error: 'user_id, game, and score are required' });
  }
  if (!GAMES.includes(game)) {
    return res.status(400).json({ error: 'Invalid game' });
  }
  if (typeof score !== 'number' || score < 0 || score > MAX_SCORES[game]) {
    return res.status(400).json({ error: 'Invalid score' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO scores (user_id, game, score) VALUES ($1, $2, $3) RETURNING id, score, played_at',
      [user_id, game, score]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving score:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
