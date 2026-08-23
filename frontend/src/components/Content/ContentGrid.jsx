import { motion } from 'framer-motion'
import { ContentLoader } from '../Common/LoadingSpinner'
import AnimeCard from './AnimeCard'
import MangaCard from './MangaCard'
import ManhowaCard from './ManhowaCard'
import t from '../../utils/translations'

const ContentGrid = ({ contents, type, loading }) => {
  if (loading) {
    return <ContentLoader />
  }

  if (!contents || contents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-400">{t.noResults}</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {contents.map((item, index) => {
        if (type === 'anime') {
          return <AnimeCard key={item.id} anime={item} index={index} />
        } else if (type === 'manga') {
          return <MangaCard key={item.id} manga={item} index={index} />
        } else if (type === 'manhwa') {
          return <ManhowaCard key={item.id} manhwa={item} index={index} />
        }
        return null
      })}
    </div>
  )
}

export default ContentGrid
