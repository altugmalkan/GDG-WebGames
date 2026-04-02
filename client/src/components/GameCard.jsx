import { useNavigate } from 'react-router-dom'

const COLOR_MAP = {
  'gdg-blue': {
    border: 'border-gdg-blue/30 hover:border-gdg-blue/60',
    accent: 'bg-gdg-blue',
    gradient: 'from-gdg-blue/10',
    shadow: 'hover:shadow-lg hover:shadow-gdg-blue/20',
    iconBg: 'bg-gdg-blue/15',
    iconText: 'text-gdg-blue',
    liveDot: 'bg-gdg-blue',
  },
  'gdg-red': {
    border: 'border-gdg-red/30 hover:border-gdg-red/60',
    accent: 'bg-gdg-red',
    gradient: 'from-gdg-red/10',
    shadow: 'hover:shadow-lg hover:shadow-gdg-red/20',
    iconBg: 'bg-gdg-red/15',
    iconText: 'text-gdg-red',
    liveDot: 'bg-gdg-red',
  },
  'gdg-green': {
    border: 'border-gdg-green/30 hover:border-gdg-green/60',
    accent: 'bg-gdg-green',
    gradient: 'from-gdg-green/10',
    shadow: 'hover:shadow-lg hover:shadow-gdg-green/20',
    iconBg: 'bg-gdg-green/15',
    iconText: 'text-gdg-green',
    liveDot: 'bg-gdg-green',
  },
  'gdg-yellow': {
    border: 'border-gdg-yellow/30 hover:border-gdg-yellow/60',
    accent: 'bg-gdg-yellow',
    gradient: 'from-gdg-yellow/10',
    shadow: 'hover:shadow-lg hover:shadow-gdg-yellow/20',
    iconBg: 'bg-gdg-yellow/15',
    iconText: 'text-gdg-yellow',
    liveDot: 'bg-gdg-yellow',
  },
}

const GAME_ICONS = {
  'card-match': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  ),
  'code-breaker': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
         strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  'bug-hunt': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" className="w-6 h-6">
      <path d="M12 9a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0v-2a4 4 0 0 1 4-4z" />
      <path d="M10 8V6a2 2 0 1 1 4 0v2" />
      <path d="M4 13h3M17 13h3" />
      <path d="M5 19l2-2M17 17l2 2" />
    </svg>
  ),
  'sort-race': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <rect x="3" y="15" width="4" height="6" rx="1" />
      <rect x="9.5" y="10" width="4" height="11" rx="1" />
      <rect x="16" y="5" width="4" height="16" rx="1" />
    </svg>
  ),
  'quiz': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9a3 3 0 1 1 3.9 2.9C12.4 12.3 12 12.8 12 14" />
      <circle cx="12" cy="17" r=".5" fill="currentColor" />
    </svg>
  ),
}

export default function GameCard({ game, lives, nextReset }) {
  const navigate = useNavigate()
  const colors = COLOR_MAP[game.color] ?? COLOR_MAP['gdg-blue']
  const hasLives = lives > 0

  const resetTime = nextReset
    ? new Date(nextReset).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <button
      onClick={() => navigate(`/game/${game.id}`)}
      className={`relative w-full p-4 rounded-2xl bg-gradient-to-r ${colors.gradient} to-transparent
                  bg-dark-card border-2 ${colors.border} text-left overflow-hidden
                  transition-all active:scale-[0.98] ${colors.shadow}`}
    >
      {/* Left accent strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.accent}`} />

      <div className="flex items-center gap-4 pl-2">
        {/* Icon container */}
        <div className={`w-12 h-12 rounded-xl ${colors.iconBg} ${colors.iconText}
                         flex items-center justify-center shrink-0`}>
          {GAME_ICONS[game.id]}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white">{game.title}</h3>
          <p className="text-xs text-slate-400 truncate mt-0.5">{game.description}</p>
        </div>

        {/* Lives dots */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors
                  ${i < lives ? colors.liveDot : 'bg-slate-700'}`}
              />
            ))}
          </div>
          {!hasLives && resetTime && (
            <span className="text-xs text-gdg-yellow font-medium">{resetTime}</span>
          )}
          {hasLives && (
            <span className="text-xs text-slate-500">{lives}/3</span>
          )}
        </div>
      </div>
    </button>
  )
}
