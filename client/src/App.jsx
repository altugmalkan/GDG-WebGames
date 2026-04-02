import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext'
import Landing from './pages/Landing'
import Hub from './pages/Hub'
import GameScreen from './pages/GameScreen'
import LeaderboardPage from './pages/LeaderboardPage'

function ProtectedRoute({ children }) {
  const { user } = useUser()
  if (!user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <div className="max-w-md mx-auto px-4">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/hub" element={<ProtectedRoute><Hub /></ProtectedRoute>} />
        <Route path="/game/:gameId" element={<ProtectedRoute><GameScreen /></ProtectedRoute>} />
        <Route path="/leaderboard/:game" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
