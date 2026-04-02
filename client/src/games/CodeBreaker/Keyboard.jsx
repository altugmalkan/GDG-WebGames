const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

export default function Keyboard({ onKey, disabled }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1">
          {row.map((key) => {
            const isWide = key === 'ENTER' || key === '⌫'
            return (
              <button
                key={key}
                onClick={() => !disabled && onKey(key)}
                disabled={disabled}
                className={`${isWide ? 'px-3 min-w-[52px]' : 'min-w-[32px]'}
                           h-12 rounded-lg border text-sm font-bold
                           bg-dark-surface text-white border-slate-600
                           transition-all duration-150 active:scale-95 active:bg-slate-500
                           disabled:opacity-50`}
              >
                {key === 'ENTER' ? '↵' : key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
