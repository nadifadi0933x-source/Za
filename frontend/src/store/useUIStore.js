import { create } from 'zustand'

const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  language: 'fa',
  notifications: [],
  isMobile: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setTheme: (theme) => set({ theme }),

  setLanguage: (language) => set({ language }),

  addNotification: (notification) => {
    const id = Date.now()
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }))
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    }, 5000)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  setMobile: (isMobile) => set({ isMobile }),
}))

export default useUIStore
export { useUIStore }
