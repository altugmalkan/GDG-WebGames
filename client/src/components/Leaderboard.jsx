import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../context/UserContext'
import * as api from '../services/api'

const PODIUM_COLORS = [
  'from-yellow-500/20 to-yellow-600/5 border-yellow-500/40',
  'from-slate-300/15 to-slate-400/5 border-slate-400/30',
  'from-amber-700/15 to-amber-800/5 border-amber-700/30',
]
const PODIUM_RING = [
  'ring-yellow-500/50 bg-yellow-500/10',
  'ring-slate-400/40 bg-slate-400/10',
  'ring-amber-700/40 bg-amber-700/10',
]
const PODIUM_LABELS = ['1.', '2.', '3.']

export default function Leaderboard({ game, limit = 10 }) {
  const { user } = useUser()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getLeaderboard(game)
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [game])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin w-6 h-6 border-2 border-gdg-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-3xl mb-2">🏜️</p>
        <p className="text-slate-500">Henüz skor yok</p>
        <p className="text-slate-600 text-sm mt-1">İlk sen ol!</p>
      </div>
    )
  }

  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3, limit)

  return (
    <div className="flex flex-col gap-4">
      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-3 pt-4 pb-2">
        {[1, 0, 2].map((podiumIndex) => {
          const entry = top3[podiumIndex]
          if (!entry) return <div key={podiumIndex} className="w-24" />
          const isCurrentUser = entry.nickname === user?.nickname
          const heights = ['h-28', 'h-22', 'h-18']

          return (
            <motion.div
              key={podiumIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: podiumIndex * 0.1 }}
              className="flex flex-col items-center gap-2 w-24"
            >
              {/* Avatar circle */}
              <div className={`w-11 h-11 rounded-full ring-2 flex items-center justify-center
                              ${PODIUM_RING[podiumIndex]}`}>
                <span className="text-sm font-bold text-white">
                  {entry.nickname.slice(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Name */}
              <p className={`text-xs font-medium truncate w-full text-center
                            ${isCurrentUser ? 'text-gdg-blue' : 'text-slate-300'}`}>
                {entry.nickname}
              </p>

              {/* Podium bar */}
              <div className={`w-full ${heights[podiumIndex]} rounded-t-xl
                              bg-gradient-to-b border border-b-0
                              ${PODIUM_COLORS[podiumIndex]}
                              flex flex-col items-center justify-start pt-2 gap-1`}>
                <span className="text-xs font-bold text-slate-400">{PODIUM_LABELS[podiumIndex]}</span>
                <span className="text-sm font-bold text-white">{entry.score}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Remaining entries */}
      {rest.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {rest.map((entry, i) => {
            const rank = i + 4
            const isCurrentUser = entry.nickname === user?.nickname
            return (
              <motion.div
                key={rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors
                            ${isCurrentUser
                              ? 'bg-gdg-blue/10 border border-gdg-blue/20'
                              : 'bg-dark-card/60 hover:bg-dark-card'
                            }`}
              >
                <span className="w-6 text-center text-sm text-slate-500 font-mono">{rank}</span>
                <span className={`flex-1 truncate text-sm ${isCurrentUser ? 'text-gdg-blue font-semibold' : 'text-slate-300'}`}>
                  {entry.nickname}
                </span>
                <span className="text-sm font-semibold text-slate-200">{entry.score}</span>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
