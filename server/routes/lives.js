const express = require('express');
const router = express.Router();
const pool = require('../db');

const GAMES = ['card_match', 'code_breaker', 'bug_hunt', 'sort_race', 'quiz'];

// Reset lives if more than 5 minutes has passed since last_reset
async function refreshLives(client, userId) {
  await client.query(
    `UPDATE lives
     SET remaining = 3, last_reset = NOW()
     WHERE user_id = $1 AND NOW() - last_reset >= INTERVAL '5 minutes'`,
    [userId]
  );
}

// GET /api/users/:id/lives — Get remaining lives for all games
router.get('/:id/lives', async (req, res) => {
  const client = await pool.connect();
  try {
    await refreshLives(client, req.params.id);

    const result = await client.query(
      'SELECT game, remaining, last_reset FROM lives WHERE user_id = $1 ORDER BY game',
      [req.params.id]
    );

    const lives = {};
    for (const row of result.rows) {
      lives[row.game] = {
        remaining: row.remaining,
        last_reset: row.last_reset,
        next_reset: new Date(new Date(row.last_reset).getTime() + 5 * 60 * 1000),
      };
    }

    res.json(lives);
  } catch (err) {
    console.error('Error fetching lives:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// POST /api/users/:id/lives/consume — Consume one life
router.post('/:id/lives/consume', async (req, res) => {
  const { game } = req.body;
  if (!game || !GAMES.includes(game)) {
    return res.status(400).json({ error: 'Invalid game' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // First refresh if needed
    await refreshLives(client, req.params.id);

    // Atomic decrement — only if remaining > 0
    const result = await client.query(
      `UPDATE lives SET remaining = remaining - 1
       WHERE user_id = $1 AND game = $2 AND remaining > 0
       RETURNING remaining`,
      [req.params.id, game]
    );

    await client.query('COMMIT');

    if (result.rows.length === 0) {
      // Get next reset time
      const livesResult = await client.query(
        'SELECT last_reset FROM lives WHERE user_id = $1 AND game = $2',
        [req.params.id, game]
      );
      const nextReset = livesResult.rows.length > 0
        ? new Date(new Date(livesResult.rows[0].last_reset).getTime() + 5 * 60 * 1000)
        : null;
      return res.status(403).json({ error: 'No lives remaining', next_reset: nextReset });
    }

    res.json({ remaining: result.rows[0].remaining });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error consuming life:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// POST /api/users/:id/lives/reset — DEV ONLY: Reset all lives to 3
router.post('/:id/lives/reset', async (req, res) => {
  try {
    await pool.query(
      'UPDATE lives SET remaining = 3, last_reset = NOW() WHERE user_id = $1',
      [req.params.id]
    );
    res.json({ message: 'All lives reset to 3' });
  } catch (err) {
    console.error('Error resetting lives:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
