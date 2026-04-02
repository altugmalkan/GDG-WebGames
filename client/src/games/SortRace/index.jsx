import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Timer from '../../components/Timer'
import DragList from './DragList'
import { pickSets } from './setsData'

const TOTAL_ROUNDS = 5
const ROUND_SECONDS = 20

export default function SortRace({ onGameEnd }) {
  const [sets] = useState(() => pickSets(TOTAL_ROUNDS))
  const [round, setRound] = useState(0)
  const [items, setItems] = useState(sets[0].items)
  const [result, setResult] = useState(null)    // null | boolean[] (per item correctness)
  const [totalScore, setTotalScore] = useState(0)
  const [timerKey, setTimerKey] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const timeLeftRef = useRef(ROUND_SECONDS)
  const gameOverRef = useRef(false)

  function scoreRound(currentItems) {
    const correct = sets[round].correctOrder
    const results = currentItems.map((item, i) => item.name === correct[i].name)
    const correctCount = results.filter(Boolean).length
    const score = (correctCount * 20) + (timeLeftRef.current * 2)
    return { results, score }
  }

  function submitRound(currentItems) {
    if (submitted || gameOverRef.current) return

    setTimerRunning(false)
    setSubmitted(true)

    const { results, score } = scoreRound(currentItems || items)
    setResult(results)
    const newTotal = totalScore + score
    setTotalScore(newTotal)

    setTimeout(() => {
      const nextIdx = round + 1
      if (nextIdx >= TOTAL_ROUNDS) {
        gameOverRef.current = true
        onGameEnd(newTotal)
        return
      }

      setRound(nextIdx)
      setItems(sets[nextIdx].items)
      setResult(null)
      setSubmitted(false)
      setTimerRunning(true)
      timeLeftRef.current = ROUND_SECONDS
      setTimerKey(prev => prev + 1)
    }, 2000)
  }

  function handleTimerEnd() {
    submitRound(items)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Round info */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          Round {round + 1}/{TOTAL_ROUNDS}
        </span>
        <span className="text-sm font-semibold text-gdg-yellow">
          {totalScore} puan
        </span>
      </div>

      {/* Timer */}
      <Timer
        key={timerKey}
        seconds={ROUND_SECONDS}
        onEnd={handleTimerEnd}
        running={timerRunning}
        onTick={(t) => { timeLeftRef.current = t }}
      />

      {/* Instruction */}
      <p className="text-center text-sm text-slate-400">
        Eskiden yeniye sırala (yukarıdan aşağıya)
      </p>

      {/* Draggable list */}
      <DragList
        items={items}
        onReorder={setItems}
        disabled={submitted}
        result={result}
      />

      {/* Submit button */}
      {!submitted && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => submitRound(items)}
          className="w-full py-3 rounded-xl bg-gdg-blue text-white font-semibold
                     hover:brightness-110 transition-all mt-2"
        >
          Onayla
        </motion.button>
      )}

      {/* Round result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-sm text-slate-400">
            {result.filter(Boolean).length}/{items.length} doğru
          </span>
        </motion.div>
      )}
    </div>
  )
}
