import { useState, useRef } from 'react'

export default function DragList({ items, onReorder, disabled, result }) {
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const listRef = useRef(null)
  const itemRects = useRef([])

  function captureRects() {
    if (!listRef.current) return
    const children = listRef.current.children
    itemRects.current = Array.from(children).map(el => {
      const rect = el.getBoundingClientRect()
      return { top: rect.top, bottom: rect.bottom, mid: rect.top + rect.height / 2 }
    })
  }

  function getDropIndex(clientY) {
    for (let i = 0; i < itemRects.current.length; i++) {
      if (clientY < itemRects.current[i].mid) return i
    }
    return itemRects.current.length
  }

  function handlePointerDown(e, idx) {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    captureRects()
    setDragIdx(idx)
    setOverIdx(idx)
  }

  function handlePointerMove(e) {
    if (dragIdx === null) return
    const dropIdx = getDropIndex(e.clientY)
    setOverIdx(Math.min(dropIdx, items.length - 1))
  }

  function handlePointerUp() {
    if (dragIdx === null) return
    if (overIdx !== null && overIdx !== dragIdx) {
      const newItems = [...items]
      const [moved] = newItems.splice(dragIdx, 1)
      newItems.splice(overIdx, 0, moved)
      onReorder(newItems)
    }
    setDragIdx(null)
    setOverIdx(null)
  }

  return (
    <div ref={listRef} className="flex flex-col gap-2" style={{ touchAction: 'none' }}>
      {items.map((item, i) => {
        const isDragging = dragIdx === i
        const isOver = overIdx === i && dragIdx !== null && dragIdx !== i

        let borderClass = 'border-slate-600'
        let bgClass = 'bg-dark-card'
        if (result) {
          const isCorrect = result[i]
          borderClass = isCorrect ? 'border-gdg-green' : 'border-gdg-red'
          bgClass = isCorrect ? 'bg-gdg-green/10' : 'bg-gdg-red/10'
        }

        return (
          <div
            key={item.name}
            onPointerDown={(e) => handlePointerDown(e, i)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2
                       select-none cursor-grab active:cursor-grabbing
                       transition-all duration-150
                       ${borderClass} ${bgClass}
                       ${isDragging ? 'opacity-50 scale-95' : ''}
                       ${isOver ? 'border-gdg-blue border-dashed' : ''}
                       ${disabled ? 'cursor-default' : ''}`}
          >
            <span className="text-slate-500 text-sm font-mono w-5">{i + 1}</span>
            <span className="flex-1 text-white font-medium">{item.name}</span>
            {result && (
              <span className="text-xs text-slate-400">{item.year}</span>
            )}
            {!disabled && (
              <span className="text-slate-500 text-lg">⠿</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
