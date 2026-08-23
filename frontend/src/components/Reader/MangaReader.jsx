import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageGallery from './ImageGallery'
import NavigationPanel from './NavigationPanel'
import ZoomControls from './ZoomControls'
import { useParams } from 'react-router-dom'
import { useFetchContent } from '../../hooks/useContent'
import { ContentLoader } from '../Common/LoadingSpinner'
import useUIStore from '../../store/useUIStore'

const MangaReader = ({ type }) => {
  const { id, chapterId } = useParams()
  const { data, isLoading } = useFetchContent(id)
  const { addNotification } = useUIStore()

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [showNavigation, setShowNavigation] = useState(true)
  const [readingMode, setReadingMode] = useState('webtoon')

  const chapters = data?.chapters || []
  const currentChapter = chapters[currentChapterIndex] || chapters[0]

  useEffect(() => {
    if (chapterId && chapters.length > 0) {
      const index = chapters.findIndex((ch) => ch.id === chapterId)
      if (index !== -1) {
        setCurrentChapterIndex(index)
      }
    }
  }, [chapterId, chapters])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousPage()
      } else if (e.key === 'ArrowRight') {
        goToNextPage()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const goToNextPage = useCallback(() => {
    if (!currentChapter) return
    if (currentPageIndex < currentChapter.pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1)
    } else if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1)
      setCurrentPageIndex(0)
    }
  }, [currentPageIndex, currentChapter, currentChapterIndex, chapters])

  const goToPreviousPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1)
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1)
      const prevChapter = chapters[currentChapterIndex - 1]
      setCurrentPageIndex(prevChapter.pages.length - 1)
    }
  }, [currentPageIndex, currentChapterIndex, chapters])

  const handleChapterChange = (index) => {
    setCurrentChapterIndex(index)
    setCurrentPageIndex(0)
  }

  if (isLoading) {
    return <ContentLoader />
  }

  if (!data || !currentChapter) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">فصلی یافت نشد</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-white font-medium">{data.title}</h1>
          <p className="text-gray-400 text-sm">
            فصل {currentChapter.number} - {currentChapter.title}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ZoomControls zoom={zoom} onZoomChange={setZoom} />
          <select
            value={readingMode}
            onChange={(e) => setReadingMode(e.target.value)}
            className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded border border-gray-700"
          >
            <option value="webtoon">وبتون</option>
            <option value="single">تک صفحه</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence>
          {showNavigation && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-900 border-l border-gray-800 overflow-hidden"
            >
              <NavigationPanel
                chapters={chapters}
                currentChapterIndex={currentChapterIndex}
                onChapterChange={handleChapterChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-auto flex items-center justify-center">
          {readingMode === 'webtoon' ? (
            <div className="space-y-1">
              {currentChapter.pages.map((page, index) => (
                <ImageGallery
                  key={page.id}
                  src={page.url}
                  alt={`صفحه ${index + 1}`}
                  zoom={zoom}
                />
              ))}
            </div>
          ) : (
            <div className="relative">
              {currentChapter.pages[currentPageIndex] && (
                <ImageGallery
                  src={currentChapter.pages[currentPageIndex].url}
                  alt={`صفحه ${currentPageIndex + 1}`}
                  zoom={zoom}
                />
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPageIndex === 0 && currentChapterIndex === 0}
                  className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-white text-sm">
                  {currentPageIndex + 1} / {currentChapter.pages.length}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPageIndex === currentChapter.pages.length - 1 && currentChapterIndex === chapters.length - 1}
                  className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MangaReader
