import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // login function accepts role too
  const login = async ({ username, password, role }) => {
    // Hardcoded credentials
    const credentials = {
      session: { username: 'sessionadmin', password: '54321' },
      general: { username: 'generaladmin', password: '12345' },
    }

    const validUser = credentials[role]
    if (!validUser || username !== validUser.username || password !== validUser.password) {
      throw new Error('Invalid credentials')
    }

    const loggedInUser = { username, role }
    setUser(loggedInUser)
    return loggedInUser
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
