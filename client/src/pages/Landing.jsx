import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const DOT_COLORS = ['bg-gdg-blue', 'bg-gdg-red', 'bg-gdg-yellow', 'bg-gdg-green']
const DOT_SHADOWS = [
  'shadow-[0_0_12px_rgba(66,133,244,0.6)]',
  'shadow-[0_0_12px_rgba(234,67,53,0.6)]',
  'shadow-[0_0_12px_rgba(251,188,5,0.6)]',
  'shadow-[0_0_12px_rgba(52,168,83,0.6)]',
]

export default function Landing() {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user, loading, login } = useUser()
  const navigate = useNavigate()

  if (!loading && user) {
    navigate('/hub', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = nickname.trim()
    if (!trimmed) {
      setError('Lütfen bir takma ad girin')
      return
    }
    if (trimmed.length > 30) {
      setError('Takma ad en fazla 30 karakter olabilir')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await login(trimmed)
      navigate('/hub')
    } catch {
      setError('Bir hata oluştu, tekrar deneyin')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="animate-spin w-8 h-8 border-2 border-gdg-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-dvh py-8 z-10">
      {/* Decorative background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-30%] w-96 h-96 rounded-full bg-gdg-blue/20 blur-3xl" />
        <div className="absolute top-[-5%] right-[-30%] w-80 h-80 rounded-full bg-gdg-red/15 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[20%] w-80 h-80 rounded-full bg-gdg-yellow/10 blur-3xl" />
      </div>

      {/* Logo + Title */}
      <div className="text-center mb-8 z-10">
        <div className="flex justify-center gap-3 mb-5">
          {DOT_COLORS.map((c, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full ${c} ${DOT_SHADOWS[i]}`}
            />
          ))}
        </div>
        <h1 className="text-4xl font-extrabold text-white">GDG on Campus</h1>
        <p className="text-base text-slate-400 mt-2 font-medium">IKCU Stand Oyunları</p>
      </div>

      {/* Glass form card */}
      <div className="w-full max-w-xs z-10 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <p className="text-sm text-slate-400 text-center mb-4">
          QR kodu tarayarak buraya geldiniz. Bir takma ad seçin ve 5 farklı oyunda yarışın!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Takma adınızı girin"
              maxLength={30}
              autoFocus
              className="w-full px-4 py-3 rounded-2xl bg-dark-card/80 border border-white/10
                         text-white placeholder-slate-500 text-center text-lg
                         focus:outline-none focus:border-gdg-blue focus:ring-1 focus:ring-gdg-blue/50
                         transition-colors"
            />
            {error && <p className="text-gdg-red text-sm mt-2 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gdg-blue to-blue-500
                       text-white font-semibold text-lg
                       hover:brightness-110 active:scale-[0.98] transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gdg-blue/25"
          >
            {submitting ? 'Giriş yapılıyor...' : 'Oyunlara Başla'}
          </button>
        </form>
      </div>
    </div>
  )
}
