import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Timer from '../../components/Timer'
import { pickQuestions } from './questionsData'

const TOTAL_QUESTIONS = 10
const QUESTION_SECONDS = 15
const REVEAL_DELAY = 1500

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function Quiz({ onGameEnd }) {
  const [questions] = useState(() => pickQuestions(TOTAL_QUESTIONS))
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)     // index of chosen option
  const [revealed, setRevealed] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [timerKey, setTimerKey] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const timeLeftRef = useRef(QUESTION_SECONDS)
  const gameOverRef = useRef(false)

  const current = questions[qIndex]

  function handleAnswer(optionIdx) {
    if (revealed || gameOverRef.current) return

    setSelected(optionIdx)
    setRevealed(true)
    setTimerRunning(false)

    const isCorrect = optionIdx === current.correct
    let earned = 0
    if (isCorrect) {
      earned = 50 + (timeLeftRef.current * 2)
      setCorrectCount(prev => prev + 1)
    }
    const newTotal = totalScore + earned
    setTotalScore(newTotal)

    setTimeout(() => advanceQuestion(newTotal), REVEAL_DELAY)
  }

  function handleTimeout() {
    if (revealed || gameOverRef.current) return
    setSelected(-1) // no selection
    setRevealed(true)
    setTimerRunning(false)

    setTimeout(() => advanceQuestion(totalScore), REVEAL_DELAY)
  }

  function advanceQuestion(currentTotal) {
    const nextIdx = qIndex + 1
    if (nextIdx >= TOTAL_QUESTIONS) {
      gameOverRef.current = true
      onGameEnd(currentTotal)
      return
    }

    setQIndex(nextIdx)
    setSelected(null)
    setRevealed(false)
    setTimerRunning(true)
    timeLeftRef.current = QUESTION_SECONDS
    setTimerKey(prev => prev + 1)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          Soru {qIndex + 1}/{TOTAL_QUESTIONS}
        </span>
        <span className="text-sm font-semibold text-gdg-yellow">
          {totalScore} puan
        </span>
      </div>

      {/* Question dots */}
      <div className="flex justify-center gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors
              ${i < qIndex ? 'bg-gdg-green' : i === qIndex ? 'bg-gdg-blue' : 'bg-dark-surface'}`}
          />
        ))}
      </div>

      {/* Timer */}
      <Timer
        key={timerKey}
        seconds={QUESTION_SECONDS}
        onEnd={handleTimeout}
        running={timerRunning}
        onTick={(t) => { timeLeftRef.current = t }}
      />

      {/* Question */}
      <motion.div
        key={qIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-dark-card rounded-2xl p-5 border border-slate-700/50"
      >
        <p className="text-white font-medium text-base leading-relaxed">
          {current.q}
        </p>
      </motion.div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {current.options.map((option, i) => {
          let btnClass = 'bg-dark-card border-slate-600 text-white hover:border-slate-400'

          if (revealed) {
            if (i === current.correct) {
              btnClass = 'bg-gdg-green/15 border-gdg-green text-gdg-green'
            } else if (i === selected && i !== current.correct) {
              btnClass = 'bg-gdg-red/15 border-gdg-red text-gdg-red'
            } else {
              btnClass = 'bg-dark-card border-slate-700 text-slate-500'
            }
          }

          return (
            <motion.button
              key={i}
              whileTap={!revealed ? { scale: 0.97 } : {}}
              onClick={() => handleAnswer(i)}
              disabled={revealed}
              className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl
                         border-2 text-left transition-all
                         disabled:cursor-default
                         ${btnClass}`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                ${revealed && i === current.correct
                  ? 'bg-gdg-green/20 text-gdg-green'
                  : revealed && i === selected
                    ? 'bg-gdg-red/20 text-gdg-red'
                    : 'bg-dark-surface text-slate-400'
                }`}>
                {OPTION_LABELS[i]}
              </span>
              <span className="flex-1 text-sm font-medium">{option}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
