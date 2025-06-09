import { createContext, useState, useEffect } from "react"
import * as auth from "../utils/auth"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      const loggedIn = await auth.checkAuth()
      setIsLoggedIn(loggedIn)
    }
    initAuth()
  }, [])

  const login = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken)
    localStorage.setItem(REFRESH_TOKEN, refreshToken)
    setIsLoggedIn(true)
  }

  const logout = () => {
    auth.clearSession()
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
