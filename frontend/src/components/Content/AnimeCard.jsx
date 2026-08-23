import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useContentStore } from '../../store/useContentStore'
import { formatDate, getStatusLabel, classNames } from '../../utils/helpers'
import RatingStars from './RatingStars'

const AnimeCard = ({ anime, index = 0 }) => {
  const { addToFavorites, isFavorite } = useContentStore()

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite(anime.id)) {
      useContentStore.getState().removeFromFavorites(anime.id)
    } else {
      addToFavorites(anime)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
    >
      <Link to={`/anime/${anime.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={anime.coverImage}
            alt={anime.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 left-2">
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
              {getStatusLabel(anime.status)}
            </span>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={classNames(
              'absolute top-2 right-2 p-2 rounded-full transition-colors',
              isFavorite(anime.id)
                ? 'bg-red-500 text-white'
                : 'bg-black/50 text-white hover:bg-red-500'
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {anime.episodes && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {anime.episodes.length} قسمت
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {anime.title}
          </h3>
          <div className="flex items-center justify-between">
            <RatingStars rating={anime.rating} size="sm" />
            <span className="text-gray-400 text-xs">{formatDate(anime.releaseDate)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default AnimeCard
