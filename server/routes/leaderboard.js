const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/leaderboard/:game — Top 10 (each user's best score)
router.get('/:game', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.nickname, MAX(s.score) as score, MIN(s.played_at) as played_at
       FROM scores s
       JOIN users u ON u.id = s.user_id
       WHERE s.game = $1
       GROUP BY s.user_id, u.nickname
       ORDER BY score DESC, played_at ASC
       LIMIT 10`,
      [req.params.game]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leaderboard/:game/top3 — Top 3 only
router.get('/:game/top3', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.nickname, MAX(s.score) as score
       FROM scores s
       JOIN users u ON u.id = s.user_id
       WHERE s.game = $1
       GROUP BY s.user_id, u.nickname
       ORDER BY score DESC, MIN(s.played_at) ASC
       LIMIT 3`,
      [req.params.game]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top 3:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
