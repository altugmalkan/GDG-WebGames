const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, ...data }
  return data
}

export function createUser(nickname) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify({ nickname }),
  })
}

export function getUser(id) {
  return request(`/users/${id}`)
}

export function getLives(userId) {
  return request(`/users/${userId}/lives`)
}

export function consumeLife(userId, game) {
  return request(`/users/${userId}/lives/consume`, {
    method: 'POST',
    body: JSON.stringify({ game }),
  })
}

export function saveScore(userId, game, score) {
  return request('/scores', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, game, score }),
  })
}

export function getLeaderboard(game) {
  return request(`/leaderboard/${game}`)
}

export function getTop3(game) {
  return request(`/leaderboard/${game}/top3`)
}

export function resetLives(userId) {
  return request(`/users/${userId}/lives/reset`, { method: 'POST' })
}
