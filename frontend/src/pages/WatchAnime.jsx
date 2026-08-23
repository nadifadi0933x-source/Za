import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFetchContent } from '../hooks/useContent'
import VideoPlayer from '../components/Player/VideoPlayer'
import { ContentLoader } from '../components/Common/LoadingSpinner'
import { useContentStore } from '../store/useContentStore'
import useUIStore from '../store/useUIStore'

const WatchAnime = () => {
  const { id, episodeId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useFetchContent(id)
  const { addToWatchHistory } = useContentStore()
  const { addNotification } = useUIStore()

  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (episodeId) {
      setCurrentEpisode(parseInt(episodeId))
    }
  }, [episodeId])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentEpisode])

  const handleEpisodeChange = (newEpisode) => {
    setCurrentEpisode(newEpisode)
    navigate(`/watch/${id}/${newEpisode}`, { replace: true })
  }

  if (isLoading) {
    return <ContentLoader />
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">انیمه مورد نظر یافت نشد</p>
      </div>
    )
  }

  const currentEpisodeData = data.episodes?.find((ep) => ep.id === currentEpisode || ep.number === currentEpisode)
  const episodeNumber = currentEpisodeData?.number || currentEpisode

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <VideoPlayer
        src={currentEpisodeData?.videoUrl || data.trailer}
        poster={data.bannerImage}
        title={data.title}
        episodes={data.episodes}
        currentEpisode={episodeNumber}
        onEpisodeChange={handleEpisodeChange}
      />

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
        <p className="text-gray-400 mb-4">
          قسمت {episodeNumber} - {currentEpisodeData?.title || ''}
        </p>
        <p className="text-gray-300 leading-relaxed">{data.description}</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">قسمت‌های دیگر</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.episodes?.map((episode) => (
            <button
              key={episode.id}
              onClick={() => handleEpisodeChange(episode.number)}
              className={`p-4 rounded-lg text-center transition-colors ${
                episode.number === currentEpisode
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <p className="font-medium">قسمت {episode.number}</p>
              <p className="text-sm mt-1 opacity-75">{episode.title}</p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default WatchAnime
