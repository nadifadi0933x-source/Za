import { motion } from 'framer-motion'
import { useFetchFavorites } from '../../hooks/useAuth'
import AnimeCard from '../Content/AnimeCard'
import MangaCard from '../Content/MangaCard'
import ManhowaCard from '../Content/ManhowaCard'
import { ContentLoader } from '../Common/LoadingSpinner'
import t from '../../utils/translations'

const FavoritesPage = () => {
  const { data: favorites, isLoading } = useFetchFavorites()

  if (isLoading) {
    return <ContentLoader />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">{t.favorites}</h1>

      {!favorites || favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-gray-400">هنوز محتوای علاقه‌مندانه‌ای ندارید</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((item, index) => {
            if (item.type === 'anime') {
              return <AnimeCard key={item.id} anime={item} index={index} />
            } else if (item.type === 'manga') {
              return <MangaCard key={item.id} manga={item} index={index} />
            } else if (item.type === 'manhwa') {
              return <ManhowaCard key={item.id} manhwa={item} index={index} />
            }
            return null
          })}
        </div>
      )}
    </motion.div>
  )
}

export default FavoritesPage
