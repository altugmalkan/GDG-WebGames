import { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../services/api'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedId = localStorage.getItem('gdg_user_id')
    if (savedId) {
      api.getUser(savedId)
        .then(data => {
          setUser(data)
        })
        .catch(() => {
          localStorage.removeItem('gdg_user_id')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(nickname) {
    const data = await api.createUser(nickname)
    localStorage.setItem('gdg_user_id', data.id)
    setUser(data)
    return data
  }

  function logout() {
    localStorage.removeItem('gdg_user_id')
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
