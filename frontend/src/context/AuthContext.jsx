import { createContext, useContext, useState, useEffect } from 'react'
import { useCurrentUser, useLogout } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const logoutMutation = useLogout()
  const { data: userData, isLoading: userLoading } = useCurrentUser()
  const [, , removeToken] = useLocalStorage('auth_token')
  const [, , removeRefreshToken] = useLocalStorage('refresh_token')

  useEffect(() => {
    if (!userLoading) {
      if (userData?.data) {
        setUser(userData.data)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    }
  }, [userData, userLoading])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      setUser(response.data.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      setUser(response.data.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      removeToken()
      removeRefreshToken()
    }
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
