import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSearchContents } from '../../hooks/useContent'
import useUIStore from '../../store/useUIStore'
import t from '../../utils/translations'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const { data, isFetching } = useSearchContents(query)
  const inputRef = useRef(null)
  const { addNotification } = useUIStore()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsFocused(false)
    }
  }

  const handleResultClick = (result) => {
    navigate(`/${result.type}/${result.id}`)
    setQuery('')
    setIsFocused(false)
  }

  const results = data?.results || []

  return (
    <div className="relative w-full" ref={inputRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={t.search}
          className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        {isFetching && (
          <div className="absolute left-10 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
          </div>
        )}
      </form>

      <AnimatePresence>
        {isFocused && (query || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-y-auto z-50"
          >
            {results.length > 0 ? (
              results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors text-right"
                >
                  <img
                    src={result.coverImage}
                    alt={result.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{result.title}</p>
                    <p className="text-gray-400 text-xs">
                      {result.type === 'anime' ? 'انیمه' : result.type === 'manga' ? 'مانگا' : 'مانها'}
                    </p>
                  </div>
                </button>
              ))
            ) : query ? (
              <div className="p-4 text-center text-gray-400">
                {t.noResults}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
