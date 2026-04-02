import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Keyboard from './Keyboard'
import Timer from '../../components/Timer'
import { pickWords, generateMask } from './wordList'

const TOTAL_ROUNDS = 5
const ROUND_SECONDS = 20

function initRound(word) {
  const mask = generateMask(word)
  // Find indices of hidden letters (the blanks player must fill)
  const blanks = []
  for (let i = 0; i < word.length; i++) {
    if (!mask[i]) blanks.push(i)
  }
  return { word, mask, blanks }
}

export default function CodeBreaker({ onGameEnd }) {
  const [words] = useState(() => pickWords(TOTAL_ROUNDS))
  const [round, setRound] = useState(0)
  const [roundData, setRoundData] = useState(() => initRound(words[0]))
  const [input, setInput] = useState([])          // letters filled so far (for blank slots)
  const [result, setResult] = useState(null)       // 'correct' | 'wrong' | null
  const [totalScore, setTotalScore] = useState(0)
  const [timerKey, setTimerKey] = useState(0)       // force timer reset per round
  const [timerRunning, setTimerRunning] = useState(true)
  const timeLeftRef = useRef(ROUND_SECONDS)
  const gameOverRef = useRef(false)

  function nextRound(earnedScore) {
    const newTotal = totalScore + earnedScore
    setTotalScore(newTotal)

    const nextIdx = round + 1
    if (nextIdx >= TOTAL_ROUNDS) {
      gameOverRef.current = true
      onGameEnd(newTotal)
      return
    }

    setRound(nextIdx)
    setRoundData(initRound(words[nextIdx]))
    setInput([])
    setResult(null)
    setTimerRunning(true)
    timeLeftRef.current = ROUND_SECONDS
    setTimerKey(prev => prev + 1)
  }

  function checkAnswer() {
    const { word, blanks } = roundData
    const attempt = input.map((l, i) => l).join('')
    const correct = blanks.map(i => word[i]).join('')

    if (attempt === correct) {
      setResult('correct')
      setTimerRunning(false)
      const score = 100 + (timeLeftRef.current * 5)
      setTimeout(() => nextRound(score), 800)
    } else {
      setResult('wrong')
      setTimeout(() => {
        setResult(null)
        setInput([])
      }, 500)
    }
  }

  function handleKey(key) {
    if (gameOverRef.current || result) return
    const { blanks } = roundData

    if (key === '⌫') {
      setInput(prev => prev.slice(0, -1))
    } else if (key === 'ENTER') {
      if (input.length === blanks.length) {
        checkAnswer()
      }
    } else if (/^[A-Z]$/.test(key) && input.length < blanks.length) {
      const newInput = [...input, key]
      setInput(newInput)

      // Auto-check when all blanks filled
      if (newInput.length === blanks.length) {
        setTimeout(() => {
          const { word, blanks: b } = roundData
          const attempt = newInput.join('')
          const correct = b.map(i => word[i]).join('')
          if (attempt === correct) {
            setResult('correct')
            setTimerRunning(false)
            const score = 100 + (timeLeftRef.current * 5)
            setTimeout(() => nextRound(score), 800)
          } else {
            setResult('wrong')
            setTimeout(() => {
              setResult(null)
              setInput([])
            }, 500)
          }
        }, 100)
      }
    }
  }

  function handleTimerEnd() {
    if (gameOverRef.current) return
    setTimerRunning(false)
    setResult('timeout')
    setTimeout(() => nextRound(0), 1000)
  }

  // Physical keyboard
  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Enter') handleKey('ENTER')
      else if (e.key === 'Backspace') handleKey('⌫')
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const { word, mask, blanks } = roundData
  // Build display: for each letter, either show it or show input/blank
  let blankCursor = 0

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Round info */}
      <div className="flex items-center justify-between w-full">
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

      {/* Word display */}
      <motion.div
        className={`flex gap-1.5 justify-center flex-wrap
                    ${result === 'wrong' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
      >
        {word.split('').map((letter, i) => {
          const isVisible = mask[i]

          if (isVisible) {
            // Given letter
            return (
              <div
                key={i}
                className="w-[44px] h-[52px] flex items-center justify-center
                           rounded-lg border-2 border-slate-500/50 bg-dark-surface/50
                           text-xl font-bold text-slate-300"
              >
                {letter}
              </div>
            )
          }

          // Blank slot
          const blankIdx = blanks.indexOf(i)
          const filledLetter = input[blankIdx] || ''
          const isActive = blankIdx === input.length

          let borderClass = 'border-slate-600'
          let bgClass = 'bg-dark-card'
          if (result === 'correct') {
            borderClass = 'border-gdg-green'
            bgClass = 'bg-gdg-green/20'
          } else if (result === 'wrong' && filledLetter) {
            borderClass = 'border-gdg-red'
            bgClass = 'bg-gdg-red/10'
          } else if (isActive) {
            borderClass = 'border-gdg-blue'
            bgClass = 'bg-gdg-blue/10'
          } else if (filledLetter) {
            borderClass = 'border-slate-400'
          }

          return (
            <motion.div
              key={i}
              animate={filledLetter ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.15 }}
              className={`w-[44px] h-[52px] flex items-center justify-center
                         rounded-lg border-2 ${borderClass} ${bgClass}
                         text-xl font-bold text-white`}
            >
              {filledLetter}
              {!filledLetter && isActive && (
                <div className="w-0.5 h-6 bg-gdg-blue animate-pulse rounded-full" />
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Feedback */}
      {result === 'timeout' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gdg-red"
        >
          Süre doldu! Cevap: <span className="font-bold text-white">{word}</span>
        </motion.p>
      )}
      {result === 'correct' && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-sm text-gdg-green font-semibold"
        >
          Doğru! +{100 + (timeLeftRef.current * 5)} puan
        </motion.p>
      )}

      {/* Keyboard */}
      <Keyboard onKey={handleKey} disabled={!!result} />
    </div>
  )
}
