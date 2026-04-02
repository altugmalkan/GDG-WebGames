import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const COLORS = ['bg-gdg-blue', 'bg-gdg-red', 'bg-gdg-yellow', 'bg-gdg-green']

export default function Landing() {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user, loading, login } = useUser()
  const navigate = useNavigate()

  // If already logged in, go to hub
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
    <div className="flex flex-col items-center justify-center min-h-dvh gap-8 py-8">
      {/* Logo / Title */}
      <div className="text-center">
        <div className="flex justify-center gap-2 mb-4">
          {COLORS.map((c, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${c}`} />
          ))}
        </div>
        <h1 className="text-3xl font-bold text-white">
          GDG on Campus
        </h1>
        <p className="text-lg text-slate-400 mt-1">IKCU Stand Oyunları</p>
      </div>

      {/* Nickname Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
        <div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Takma adınızı girin"
            maxLength={30}
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-dark-card border border-slate-600
                       text-white placeholder-slate-500 text-center text-lg
                       focus:outline-none focus:border-gdg-blue focus:ring-1 focus:ring-gdg-blue
                       transition-colors"
          />
          {error && <p className="text-gdg-red text-sm mt-2 text-center">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-gdg-blue text-white font-semibold text-lg
                     hover:brightness-110 active:scale-[0.98] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Giriş yapılıyor...' : 'Oyunlara Başla'}
        </button>
      </form>

      <p className="text-slate-500 text-sm text-center max-w-xs">
        QR kodu tarayarak buraya geldiniz. Bir takma ad seçin ve 5 farklı oyunda yarışın!
      </p>
    </div>
  )
}
