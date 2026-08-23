import { create } from 'zustand'

const useContentStore = create((set, get) => ({
  contents: [],
  currentContent: null,
  favorites: [],
  watchHistory: [],
  bookmarks: [],
  filters: {
    type: 'all',
    genre: 'all',
    year: 'all',
    sort: 'popularity',
    search: '',
  },
  isLoading: false,
  error: null,

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  setCurrentContent: (content) => set({ currentContent: content }),

  addToFavorites: (content) => {
    const favorites = get().favorites
    if (!favorites.find((item) => item.id === content.id)) {
      set({ favorites: [...favorites, content] })
    }
  },

  removeFromFavorites: (contentId) => {
    set({ favorites: get().favorites.filter((item) => item.id !== contentId) })
  },

  isFavorite: (contentId) => {
    return get().favorites.some((item) => item.id === contentId)
  },

  addToWatchHistory: (content) => {
    const history = get().watchHistory
    const filtered = history.filter((item) => item.id !== content.id)
    set({ watchHistory: [{ ...content, watchedAt: new Date().toISOString() }, ...filtered] })
  },

  addBookmark: (content, episode = null) => {
    const bookmarks = get().bookmarks
    const newBookmark = { content, episode, bookmarkedAt: new Date().toISOString() }
    if (!bookmarks.find((item) => item.content.id === content.id && item.episode === episode)) {
      set({ bookmarks: [...bookmarks, newBookmark] })
    }
  },

  removeBookmark: (contentId, episode = null) => {
    set({
      bookmarks: get().bookmarks.filter(
        (item) => !(item.content.id === contentId && item.episode === episode)
      ),
    })
  },

  clearHistory: () => set({ watchHistory: [] }),
}))

export default useContentStore
export { useContentStore }
