import { useNavigate } from 'react-router-dom'

export default function Header({ title, showBack = true }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3 py-2">
      {showBack && (
        <button
          onClick={() => navigate('/hub')}
          className="w-10 h-10 flex items-center justify-center rounded-xl
                     bg-dark-card border border-slate-600 text-white
                     hover:bg-dark-surface transition-colors"
        >
          ←
        </button>
      )}
      <h1 className="text-xl font-bold text-white flex-1">{title}</h1>
    </div>
  )
}
