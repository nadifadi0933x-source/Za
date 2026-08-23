import { createContext, useContext, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const theme = useTheme()

  const value = {
    ...theme,
    setTheme: theme.setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
