import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import * as api from '../services/api'

const PODIUM_COLORS = [
  'from-yellow-500/30 to-yellow-600/5 border-yellow-500/40',
  'from-slate-300/15 to-slate-400/5 border-slate-400/30',
  'from-amber-700/20 to-amber-800/5 border-amber-700/30',
]
const PODIUM_RING = [
  'ring-yellow-500/60 bg-yellow-500/10',
  'ring-slate-400/40 bg-slate-400/10',
  'ring-amber-700/40 bg-amber-700/10',
]

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-gdg-yellow">
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M6 3h12v9a6 6 0 0 1-12 0V3z" />
      <path d="M9 21h6" />
      <path d="M12 18v3" />
    </svg>
  )
}

export default function ScoreScreen({ score, game, gameId, gameTitle }) {
  const navigate = useNavigate()
  const { user } = useUser()
  const [top3, setTop3] = useState([])

  useEffect(() => {
    api.getTop3(game).then(setTop3).catch(console.error)
  }, [game])

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-6 py-8">
      {/* Score display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-center"
      >
        <div className="flex justify-center mb-3">
          <TrophyIcon />
        </div>
        <p className="text-sm text-slate-400 font-medium">{gameTitle}</p>
        <p className="text-6xl font-extrabold mt-2 bg-clip-text text-transparent
                      bg-gradient-to-b from-white to-slate-400">
          {score}
        </p>
        <p className="text-xs text-slate-500 tracking-widest uppercase mt-1">puan</p>
      </motion.div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div className="w-full max-w-sm">
          <h3 className="text-xs text-slate-500 text-center mb-4 uppercase tracking-widest">
            En İyi Skorlar
          </h3>
          <div className="flex items-end justify-center gap-3">
            {[1, 0, 2].map((podiumIndex) => {
              const entry = top3[podiumIndex]
              if (!entry) return <div key={podiumIndex} className="w-24" />
              const isCurrentUser = entry.nickname === user?.nickname
              const heights = ['h-28', 'h-20', 'h-16']
              const sizes = ['w-12 h-12', 'w-10 h-10', 'w-10 h-10']

              return (
                <motion.div
                  key={podiumIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + podiumIndex * 0.1 }}
                  className="flex flex-col items-center gap-2 w-24"
                >
                  <div className={`${sizes[podiumIndex]} rounded-full ring-2 flex items-center justify-center
                                  ${PODIUM_RING[podiumIndex]}`}>
                    <span className="text-xs font-bold text-white">
                      {entry.nickname.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <p className={`text-xs font-medium truncate w-full text-center
                                ${isCurrentUser ? 'text-gdg-blue' : 'text-slate-300'}`}>
                    {entry.nickname}
                  </p>
                  <div className={`w-full ${heights[podiumIndex]} rounded-t-xl
                                  bg-gradient-to-b border border-b-0
                                  ${PODIUM_COLORS[podiumIndex]}
                                  flex flex-col items-center justify-start pt-2 gap-1`}>
                    <span className="text-sm font-bold text-white">{entry.score}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-xs mt-2">
        <button
          onClick={() => navigate(`/game/${gameId}`)}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gdg-blue to-blue-500
                     text-white font-semibold shadow-lg shadow-gdg-blue/25
                     hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Tekrar Oyna
        </button>
        <button
          onClick={() => navigate('/hub')}
          className="flex-1 py-3 rounded-xl bg-white/[0.05] border border-white/10
                     text-white font-medium hover:bg-white/[0.08] transition-colors"
        >
          Hub'a Dön
        </button>
      </div>

      <button
        onClick={() => navigate(`/leaderboard/${game}`)}
        className="text-sm text-gdg-blue hover:underline"
      >
        Tam Sıralamayı Gör →
      </button>
    </div>
  )
}
