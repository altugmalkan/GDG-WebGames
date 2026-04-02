import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Leaderboard from '../components/Leaderboard'

const GAME_TITLES = {
  card_match: 'Kart Eşleştirme',
  code_breaker: 'Kod Kırıcı',
  bug_hunt: 'Bug Avı',
  sort_race: 'Sıralama Yarışı',
  quiz: 'GDG Quiz',
}

export default function LeaderboardPage() {
  const { game } = useParams()
  const navigate = useNavigate()

  return (
    <div className="py-4">
      <Header title={GAME_TITLES[game] || game} />
      <div className="mt-4">
        <Leaderboard game={game} limit={10} />
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate('/hub')}
          className="px-6 py-3 rounded-xl bg-dark-card border border-slate-600 text-white
                     hover:bg-dark-surface transition-colors"
        >
          Hub'a Dön
        </button>
      </div>
    </div>
  )
}
