import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import GameCard from '../components/GameCard'
import Leaderboard from '../components/Leaderboard'
import * as api from '../services/api'

const GAMES = [
  {
    id: 'card-match',
    apiName: 'card_match',
    title: 'Kart Eşleştirme',
    description: '4×4 gridde 8 çift teknolojiyi eşleştir',
    color: 'gdg-blue',
  },
  {
    id: 'code-breaker',
    apiName: 'code_breaker',
    title: 'Kod Kırıcı',
    description: '5 harfli teknoloji terimini bul',
    color: 'gdg-green',
  },
  {
    id: 'bug-hunt',
    apiName: 'bug_hunt',
    title: 'Bug Avı',
    description: 'Böcekleri yakala, teknolojilere dokunma',
    color: 'gdg-red',
  },
  {
    id: 'sort-race',
    apiName: 'sort_race',
    title: 'Sıralama Yarışı',
    description: 'Teknolojileri kronolojik sırala',
    color: 'gdg-yellow',
  },
  {
    id: 'quiz',
    apiName: 'quiz',
    title: 'GDG Quiz',
    description: 'Google ve teknoloji dünyası quizi',
    color: 'gdg-blue',
  },
]

export default function Hub() {
  const { user } = useUser()
  const [lives, setLives] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedLeaderboard, setSelectedLeaderboard] = useState(null)

  useEffect(() => {
    if (user) {
      api.getLives(user.id)
        .then(setLives)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [user])

  const initials = user?.nickname?.slice(0, 2).toUpperCase() ?? '??'

  return (
    <div className="py-6">
      {/* Greeting */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gdg-blue/20 ring-2 ring-gdg-blue/40
                        flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-gdg-blue">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Hoş geldin</p>
          <h1 className="text-2xl font-bold text-white truncate">{user?.nickname}</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-gdg-blue border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {GAMES.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              lives={lives[game.apiName]?.remaining ?? 0}
              nextReset={lives[game.apiName]?.next_reset}
            />
          ))}
        </div>
      )}

      {/* Leaderboard Section */}
      <div className="mt-8 rounded-2xl bg-dark-card/50 border border-slate-700/50 overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <h2 className="text-lg font-bold text-white">Leaderboard</h2>
        </div>

        {/* Game tabs */}
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-dark-card/50 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-dark-card/50 to-transparent z-10" />

          <div className="px-4 flex gap-2 overflow-x-auto pb-3 scrollbar-none">
            {GAMES.map((game) => {
              const isActive = selectedLeaderboard === game.apiName
              return (
                <button
                  key={game.apiName}
                  onClick={() => setSelectedLeaderboard(isActive ? null : game.apiName)}
                  className={`relative px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap
                              transition-all duration-200
                    ${isActive
                      ? 'bg-gdg-blue text-white shadow-lg shadow-gdg-blue/25'
                      : 'bg-dark-surface/60 text-slate-400 hover:text-slate-200 hover:bg-dark-surface'
                    }`}
                >
                  {game.title}
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedLeaderboard ? (
            <motion.div
              key={selectedLeaderboard}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-4"
            >
              <Leaderboard game={selectedLeaderboard} limit={10} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 pb-6 text-center"
            >
              <p className="text-slate-500 text-sm">Skor tablosunu görmek için bir oyun seç</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DEV button */}
      <button
        onClick={async () => {
          await api.resetLives(user.id)
          const updated = await api.getLives(user.id)
          setLives(updated)
        }}
        className="mt-6 w-full py-1.5 text-xs text-slate-700 hover:text-slate-500 transition-colors"
      >
        Hakları Sıfırla (DEV)
      </button>
    </div>
  )
}
