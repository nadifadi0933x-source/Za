import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFetchContent } from '../hooks/useContent'
import MangaReader from '../components/Reader/MangaReader'
import { ContentLoader } from '../components/Common/LoadingSpinner'
import { useContentStore } from '../store/useContentStore'

const ReadManga = () => {
  const { id, chapterId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useFetchContent(id)
  const { addToWatchHistory } = useContentStore()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [chapterId])

  if (isLoading) {
    return <ContentLoader />
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">محتوا مورد نظر یافت نشد</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-80px)]"
    >
      <MangaReader type={data.type} contentId={id} chapterId={chapterId} />
    </motion.div>
  )
}

export default ReadManga
