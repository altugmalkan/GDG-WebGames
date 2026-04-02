export const ENTITY_TYPES = [
  { type: 'bug', emoji: '🐛', points: 10, weight: 50 },
  { type: 'bug2', emoji: '🪲', points: 10, weight: 15 },
  { type: 'virus', emoji: '💀', points: 20, weight: 10 },
  { type: 'tech', emoji: '🦋', points: -15, weight: 8 },   // Flutter
  { type: 'tech', emoji: '🔥', points: -15, weight: 5 },   // Firebase
  { type: 'tech', emoji: '🤖', points: -15, weight: 4 },   // Android
  { type: 'tech', emoji: '☁️', points: -15, weight: 4 },   // Cloud
  { type: 'tech', emoji: '🌐', points: -15, weight: 4 },   // Chrome
]

const TOTAL_WEIGHT = ENTITY_TYPES.reduce((s, e) => s + e.weight, 0)

export function pickRandomEntity() {
  let roll = Math.random() * TOTAL_WEIGHT
  for (const entity of ENTITY_TYPES) {
    roll -= entity.weight
    if (roll <= 0) return entity
  }
  return ENTITY_TYPES[0]
}

// Spawn duration decreases every 10 seconds
export function getSpawnDuration(elapsedMs) {
  const phase = Math.floor(elapsedMs / 10000)
  return 1200 * Math.pow(0.8, phase)
}
