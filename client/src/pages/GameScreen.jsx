import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import * as api from '../services/api'
import Header from '../components/Header'
import ScoreScreen from '../components/ScoreScreen'
import CardMatch from '../games/CardMatch'
import CodeBreaker from '../games/CodeBreaker'
import BugHunt from '../games/BugHunt'
import SortRace from '../games/SortRace'
import Quiz from '../games/Quiz'

const GAME_NAMES = {
  'card-match': { title: 'Kart Eşleştirme', apiName: 'card_match' },
  'code-breaker': { title: 'Kod Kırıcı', apiName: 'code_breaker' },
  'bug-hunt': { title: 'Bug Avı', apiName: 'bug_hunt' },
  'sort-race': { title: 'Sıralama Yarışı', apiName: 'sort_race' },
  'quiz': { title: 'GDG Quiz', apiName: 'quiz' },
}

export default function GameScreen() {
  const { gameId } = useParams()
  const { user } = useUser()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading | no-lives | playing | finished
  const [score, setScore] = useState(null)
  const [nextReset, setNextReset] = useState(null)

  const gameInfo = GAME_NAMES[gameId]

  const consumedRef = useRef(false)

  useEffect(() => {
    if (!gameInfo) {
      navigate('/hub', { replace: true })
      return
    }

    // Prevent double consume in StrictMode
    if (consumedRef.current) return
    consumedRef.current = true

    api.consumeLife(user.id, gameInfo.apiName)
      .then(() => setStatus('playing'))
      .catch((err) => {
        if (err.status === 403) {
          setNextReset(err.next_reset)
          setStatus('no-lives')
        } else {
          navigate('/hub', { replace: true })
        }
      })
  }, [])

  function handleGameEnd(finalScore) {
    api.saveScore(user.id, gameInfo.apiName, finalScore).catch(console.error)
    setScore(finalScore)
    setStatus('finished')
  }

  if (!gameInfo) return null

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="animate-spin w-8 h-8 border-2 border-gdg-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  if (status === 'no-lives') {
    const resetTime = nextReset ? new Date(nextReset).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '?'
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-4">
        <p className="text-4xl">😢</p>
        <h2 className="text-xl font-bold text-white">Hakkınız Kalmadı</h2>
        <p className="text-slate-400 text-center">
          Sonraki hak yenileme: <span className="text-gdg-yellow font-semibold">{resetTime}</span>
        </p>
        <button
          onClick={() => navigate('/hub')}
          className="mt-4 px-6 py-3 rounded-xl bg-dark-card border border-slate-600 text-white
                     hover:bg-dark-surface transition-colors"
        >
          Hub'a Dön
        </button>
      </div>
    )
  }

  if (status === 'finished') {
    return (
      <ScoreScreen
        score={score}
        game={gameInfo.apiName}
        gameId={gameId}
        gameTitle={gameInfo.title}
      />
    )
  }

  // status === 'playing' — render the actual game component
  const GAME_COMPONENTS = {
    'card-match': CardMatch,
    'code-breaker': CodeBreaker,
    'bug-hunt': BugHunt,
    'sort-race': SortRace,
    'quiz': Quiz,
  }

  const GameComponent = GAME_COMPONENTS[gameId]

  return (
    <div className="py-4">
      <Header title={gameInfo.title} />
      <div className="mt-4">
        {GameComponent ? (
          <GameComponent onGameEnd={handleGameEnd} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-6xl mb-4">🎮</p>
            <p className="text-slate-400 text-lg">Oyun yakında eklenecek</p>
            <button
              onClick={() => handleGameEnd(Math.floor(Math.random() * 500))}
              className="mt-6 px-6 py-3 rounded-xl bg-gdg-blue text-white font-semibold
                         hover:brightness-110 transition-all"
            >
              Test: Oyunu Bitir
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
