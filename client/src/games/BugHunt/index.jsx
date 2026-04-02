import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Timer from '../../components/Timer'
import { pickRandomEntity, getSpawnDuration } from './entityData'

const GRID_SIZE = 12 // 3x4
const MAX_VISIBLE = 3
const GAME_SECONDS = 30
const TICK_MS = 200
const SPAWN_CHANCE = 0.35

let entityIdCounter = 0

export default function BugHunt({ onGameEnd }) {
  const [score, setScore] = useState(0)
  const [entities, setEntities] = useState([]) // {id, cellIndex, entity, spawnedAt}
  const [effects, setEffects] = useState([])   // {id, cellIndex, type, points}
  const [gameOver, setGameOver] = useState(false)
  const [shaking, setShaking] = useState(false)
  const startTimeRef = useRef(Date.now())
  const scoreRef = useRef(0)

  // Game loop
  useEffect(() => {
    if (gameOver) return

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - startTimeRef.current
      const duration = getSpawnDuration(elapsed)

      setEntities(prev => {
        // Remove expired entities
        let updated = prev.filter(e => now - e.spawnedAt < duration)

        // Maybe spawn new entity
        if (updated.length < MAX_VISIBLE && Math.random() < SPAWN_CHANCE) {
          const usedCells = new Set(updated.map(e => e.cellIndex))
          const freeCells = Array.from({ length: GRID_SIZE }, (_, i) => i)
            .filter(i => !usedCells.has(i))

          if (freeCells.length > 0) {
            const cellIndex = freeCells[Math.floor(Math.random() * freeCells.length)]
            updated = [...updated, {
              id: ++entityIdCounter,
              cellIndex,
              entity: pickRandomEntity(),
              spawnedAt: now,
            }]
          }
        }

        return updated
      })
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [gameOver])

  const handleClick = useCallback((clickedEntity) => {
    if (gameOver) return

    const { entity, cellIndex, id } = clickedEntity
    const isGood = entity.points > 0

    // Remove clicked entity
    setEntities(prev => prev.filter(e => e.id !== id))

    // Update score
    setScore(prev => {
      const next = Math.max(0, prev + entity.points)
      scoreRef.current = next
      return next
    })

    // Visual feedback
    const effectId = ++entityIdCounter
    setEffects(prev => [...prev, {
      id: effectId,
      cellIndex,
      type: isGood ? 'good' : 'bad',
      points: entity.points,
    }])
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== effectId))
    }, 600)

    // Screen shake on wrong click
    if (!isGood) {
      setShaking(true)
      setTimeout(() => setShaking(false), 300)
    }
  }, [gameOver])

  function handleTimerEnd() {
    setGameOver(true)
    onGameEnd(scoreRef.current)
  }

  return (
    <div className={`flex flex-col gap-4 ${shaking ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
      {/* Score + Timer */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-sm text-slate-400">puan</span>
      </div>
      <Timer seconds={GAME_SECONDS} onEnd={handleTimerEnd} running={!gameOver} />

      {/* 3x4 Grid */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {Array.from({ length: GRID_SIZE }, (_, cellIdx) => {
          const activeEntity = entities.find(e => e.cellIndex === cellIdx)
          const effect = effects.find(e => e.cellIndex === cellIdx)

          return (
            <div
              key={cellIdx}
              className="aspect-square rounded-xl bg-dark-card border border-slate-700/50
                         flex items-center justify-center relative overflow-hidden"
            >
              {/* Entity */}
              <AnimatePresence>
                {activeEntity && (
                  <motion.button
                    key={activeEntity.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    onClick={() => handleClick(activeEntity)}
                    className="absolute inset-0 flex items-center justify-center
                               text-4xl cursor-pointer active:scale-90 transition-transform
                               select-none"
                  >
                    {activeEntity.entity.emoji}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Click feedback */}
              <AnimatePresence>
                {effect && (
                  <motion.div
                    key={effect.id}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -30 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute text-sm font-bold pointer-events-none
                               ${effect.type === 'good' ? 'text-gdg-green' : 'text-gdg-red'}`}
                  >
                    {effect.points > 0 ? `+${effect.points}` : effect.points}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-slate-500 mt-1">
        <span>🐛 +10</span>
        <span>💀 +20</span>
        <span>🦋🔥 -15</span>
      </div>
    </div>
  )
}
