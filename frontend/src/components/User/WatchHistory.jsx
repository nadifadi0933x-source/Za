import { motion } from 'framer-motion'
import { useFetchWatchHistory } from '../../hooks/useAuth'
import { ContentLoader } from '../Common/LoadingSpinner'
import { formatDate } from '../../utils/helpers'
import AnimeCard from '../Content/AnimeCard'
import MangaCard from '../Content/MangaCard'
import ManhowaCard from '../Content/ManhowaCard'
import t from '../../utils/translations'

const WatchHistory = () => {
  const { data: history, isLoading } = useFetchWatchHistory()

  if (isLoading) {
    return <ContentLoader />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{t.history}</h1>
      </div>

      {!history || history.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400">هنوز چیزی تماشا نکرده‌اید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4"
            >
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{item.title}</h3>
                <p className="text-gray-400 text-sm">
                  {item.type === 'anime' ? 'انیمه' : item.type === 'manga' ? 'مانگا' : 'مانها'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  دیده شده در {formatDate(item.watchedAt)}
                </p>
              </div>
              <div className="flex-shrink-0">
                {item.type === 'anime' ? (
                  <AnimeCard anime={item} />
                ) : item.type === 'manga' ? (
                  <MangaCard manga={item} />
                ) : (
                  <ManhowaCard manhwa={item} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default WatchHistory
