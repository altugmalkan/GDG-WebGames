import { useNavigate } from 'react-router-dom'

const COLOR_MAP = {
  'gdg-blue': 'border-gdg-blue/30 hover:border-gdg-blue/60',
  'gdg-red': 'border-gdg-red/30 hover:border-gdg-red/60',
  'gdg-green': 'border-gdg-green/30 hover:border-gdg-green/60',
  'gdg-yellow': 'border-gdg-yellow/30 hover:border-gdg-yellow/60',
}

export default function GameCard({ game, lives, nextReset }) {
  const navigate = useNavigate()
  const hasLives = lives > 0

  function handleClick() {
    navigate(`/game/${game.id}`)
  }

  const resetTime = nextReset
    ? new Date(nextReset).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <button
      onClick={handleClick}
      className={`w-full p-4 rounded-2xl bg-dark-card border-2 text-left
                  transition-all active:scale-[0.98]
                  ${COLOR_MAP[game.color] || 'border-slate-600 hover:border-slate-400'}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl">{game.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white">{game.title}</h3>
          <p className="text-sm text-slate-400 truncate">{game.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
            ${hasLives ? 'bg-gdg-green/15 text-gdg-green' : 'bg-gdg-red/15 text-gdg-red'}`}>
            {lives}/3 deneme
          </span>
          {!hasLives && resetTime && (
            <span className="text-xs text-gdg-yellow">{resetTime}</span>
          )}
        </div>
      </div>
    </button>
  )
}
