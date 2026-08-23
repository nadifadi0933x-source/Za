import { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      ...notification,
      createdAt: new Date().toISOString(),
      read: false,
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-slide-in-up' : 'animate-slide-in-down'} bg-dark-800 border border-dark-700 rounded-lg p-4 shadow-xl min-w-[300px]`}>
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'error' ? 'bg-red-500' : notification.type === 'success' ? 'bg-green-500' : notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
          <div className="flex-1">
            <p className="text-sm font-medium text-dark-100">{notification.title}</p>
            {notification.message && <p className="text-xs text-dark-400 mt-1">{notification.message}</p>}
          </div>
        </div>
      </div>
    ), {
      duration: notification.duration || 4000,
    })
    
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const value = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
