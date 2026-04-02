const express = require('express');
const router = express.Router();
const pool = require('../db');

const GAMES = ['card_match', 'code_breaker', 'bug_hunt', 'sort_race', 'quiz'];

// POST /api/users — Create new user + initialize lives for all games
router.post('/', async (req, res) => {
  const { nickname } = req.body;
  if (!nickname || nickname.trim().length === 0 || nickname.length > 30) {
    return res.status(400).json({ error: 'Nickname is required (max 30 chars)' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      'INSERT INTO users (nickname) VALUES ($1) RETURNING id, nickname, created_at',
      [nickname.trim()]
    );
    const user = userResult.rows[0];

    // Initialize 3 lives for each game
    for (const game of GAMES) {
      await client.query(
        'INSERT INTO lives (user_id, game, remaining, last_reset) VALUES ($1, $2, 3, NOW())',
        [user.id, game]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(user);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// GET /api/users/:id — Get user info
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nickname, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
