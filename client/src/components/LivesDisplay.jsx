export default function LivesDisplay({ lives, max = 3 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`text-lg transition-all ${i < lives ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}
        >
          ❤️
        </span>
      ))}
    </div>
  )
}
