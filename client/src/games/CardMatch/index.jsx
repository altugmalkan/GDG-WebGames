import { useState, useEffect, useRef, useCallback } from 'react'
import Card from './Card'
import { createDeck } from './cardData'
import Timer from '../../components/Timer'
import LivesDisplay from '../../components/LivesDisplay'

const PREVIEW_DURATION = 3000
const WRONG_DELAY = 800
const TOTAL_PAIRS = 8
const INITIAL_LIVES = 3
const GAME_SECONDS = 90

export default function CardMatch({ onGameEnd }) {
  const [cards, setCards] = useState(() => createDeck())
  const [phase, setPhase] = useState('preview') // preview | playing | ended
  const [flippedIndices, setFlippedIndices] = useState([])
  const [matchedIndices, setMatchedIndices] = useState(new Set())
  const [lives, setLives] = useState(INITIAL_LIVES)
  const [pairsFound, setPairsFound] = useState(0)
  const [locked, setLocked] = useState(false)
  const [wrongPair, setWrongPair] = useState(null)
  const timeLeftRef = useRef(GAME_SECONDS)
  const timeoutRef = useRef(null)

  // Preview phase: show all cards for 3 seconds
  useEffect(() => {
    const id = setTimeout(() => setPhase('playing'), PREVIEW_DURATION)
    return () => clearTimeout(id)
  }, [])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const endGame = useCallback((currentLives, currentPairs, currentTimeLeft) => {
    setPhase('ended')
    const score = (currentPairs * 100) + (currentTimeLeft * 2) + (currentLives * 50)
    onGameEnd(score)
  }, [onGameEnd])

  function handleTimerEnd() {
    if (phase === 'playing') {
      endGame(lives, pairsFound, 0)
    }
  }

  function handleCardClick(index) {
    if (phase !== 'playing' || locked) return
    if (flippedIndices.includes(index) || matchedIndices.has(index)) return

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      setLocked(true)
      const [first, second] = newFlipped
      const isMatch = cards[first].pairIndex === cards[second].pairIndex

      if (isMatch) {
        const newMatched = new Set(matchedIndices)
        newMatched.add(first)
        newMatched.add(second)
        setMatchedIndices(newMatched)
        const newPairs = pairsFound + 1
        setPairsFound(newPairs)
        setFlippedIndices([])
        setLocked(false)

        // Check win
        if (newPairs === TOTAL_PAIRS) {
          endGame(lives, newPairs, timeLeftRef.current)
        }
      } else {
        setWrongPair([first, second])
        timeoutRef.current = setTimeout(() => {
          setFlippedIndices([])
          setWrongPair(null)
          const newLives = lives - 1
          setLives(newLives)
          setLocked(false)

          if (newLives <= 0) {
            endGame(0, pairsFound, timeLeftRef.current)
          }
        }, WRONG_DELAY)
      }
    }
  }

  // Track time for scoring
  function handleTimeUpdate(t) {
    timeLeftRef.current = t
  }

  const isPreview = phase === 'preview'

  return (
    <div className="flex flex-col gap-4">
      {/* Status bar */}
      <div className="flex items-center justify-between gap-4">
        <LivesDisplay lives={lives} />
        <span className="text-sm text-slate-400">
          {pairsFound}/{TOTAL_PAIRS} çift
        </span>
      </div>

      {/* Timer */}
      <Timer
        seconds={GAME_SECONDS}
        onEnd={handleTimerEnd}
        running={phase === 'playing'}
        onTick={handleTimeUpdate}
      />

      {/* Preview countdown */}
      {isPreview && (
        <p className="text-center text-gdg-yellow text-sm animate-pulse">
          Kartları ezberleyin...
        </p>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, i) => (
          <Card
            key={card.uid}
            card={card}
            flipped={isPreview || flippedIndices.includes(i)}
            matched={matchedIndices.has(i)}
            disabled={locked || isPreview || phase === 'ended'}
            wrong={wrongPair?.includes(i)}
            onClick={() => handleCardClick(i)}
          />
        ))}
      </div>
    </div>
  )
}
