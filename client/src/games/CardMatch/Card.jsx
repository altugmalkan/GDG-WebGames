export default function Card({ card, flipped, matched, wrong, disabled, onClick }) {
  const isRevealed = flipped || matched
  const borderClass = matched
    ? 'ring-2 ring-gdg-green shadow-[0_0_12px_rgba(52,168,83,0.4)]'
    : wrong
      ? 'ring-2 ring-gdg-red shadow-[0_0_12px_rgba(234,67,53,0.4)]'
      : ''

  return (
    <button
      onClick={() => !disabled && !matched && !flipped && onClick()}
      disabled={disabled || matched || flipped}
      className="aspect-square perspective-[600px]"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-3d
                    ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* Back face (GDG logo / hidden) */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl
                      bg-gradient-to-br from-gdg-blue to-gdg-green
                      flex items-center justify-center
                      border-2 border-slate-600 active:scale-95 transition-transform`}
        >
          <span className="text-2xl font-bold text-white select-none">GDG</span>
        </div>

        {/* Front face (card content) */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl
                      bg-dark-card flex flex-col items-center justify-center gap-1
                      border-2 border-slate-600 ${borderClass}`}
        >
          <img src={card.icon} alt={card.name} className="w-10 h-10 object-contain select-none" draggable={false} />
          <span className="text-xs text-slate-300 font-medium select-none">{card.name}</span>
        </div>
      </div>
    </button>
  )
}
