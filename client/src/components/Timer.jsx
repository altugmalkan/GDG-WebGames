import { useState, useEffect, useRef } from 'react'

export default function Timer({ seconds, onEnd, running = true, onTick }) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const onEndRef = useRef(onEnd)
  const onTickRef = useRef(onTick)
  onEndRef.current = onEnd
  onTickRef.current = onTick

  useEffect(() => {
    if (!running || timeLeft <= 0) return

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(id)
          onTickRef.current?.(0)
          setTimeout(() => onEndRef.current?.(), 0)
          return 0
        }
        onTickRef.current?.(next)
        return next
      })
    }, 1000)

    return () => clearInterval(id)
  }, [running, timeLeft <= 0])

  const pct = (timeLeft / seconds) * 100
  const color = pct > 60 ? 'bg-gdg-green' : pct > 30 ? 'bg-gdg-yellow' : 'bg-gdg-red'

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-dark-surface overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 linear ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-white font-mono font-bold text-lg min-w-[3ch] text-right">
        {timeLeft}
      </span>
    </div>
  )
}
