import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFetchContent } from '../../hooks/useContent'
import { ContentLoader } from '../Common/LoadingSpinner'
import AnimeCard from './AnimeCard'
import MangaCard from './MangaCard'
import ManhowaCard from './ManhowaCard'
import RatingStars from './RatingStars'
import ReviewSection from './ReviewSection'
import { useContentStore } from '../../store/useContentStore'
import { formatDate, formatDuration, getStatusLabel, getContentTypeLabel } from '../../utils/helpers'
import { GENRES } from '../../utils/constants'
import { useParams, Link } from 'react-router-dom'

const ContentDetail = ({ type }) => {
  const { id } = useParams()
  const { data, isLoading, error } = useFetchContent(id)
  const { addToWatchHistory, addToFavorites, isFavorite } = useContentStore()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (isLoading) {
    return <ContentLoader />
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">خطا در بارگذاری محتوا</p>
      </div>
    )
  }

  const CardComponent = type === 'anime' ? AnimeCard : type === 'manga' ? MangaCard : ManhowaCard
  const relatedType = type === 'anime' ? 'anime' : type === 'manga' ? 'manga' : 'manhwa'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={data.bannerImage}
            alt={data.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
        </div>

        <div className="relative flex flex-col md:flex-row gap-6 p-6 pt-20">
          <div className="flex-shrink-0">
            <img
              src={data.coverImage}
              alt={data.title}
              className="w-48 h-72 object-cover rounded-xl shadow-2xl mx-auto md:mx-0"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{data.title}</h1>
              <p className="text-gray-400">{data.alternativeTitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                {getContentTypeLabel(data.type)}
              </span>
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                {getStatusLabel(data.status)}
              </span>
              <div className="flex items-center gap-1">
                <RatingStars rating={data.rating} size="sm" />
                <span className="text-gray-300 text-sm">{data.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.genres?.map((genre) => (
                <span
                  key={genre}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">سال انتشار</p>
                <p className="text-white">{data.releaseYear}</p>
              </div>
              {data.duration && (
                <div>
                  <p className="text-gray-500">مدت زمان</p>
                  <p className="text-white">{formatDuration(data.duration)}</p>
                </div>
              )}
              {data.episodes && (
                <div>
                  <p className="text-gray-500">تعداد قسمت‌ها</p>
                  <p className="text-white">{data.episodes.length}</p>
                </div>
              )}
              {data.chapters && (
                <div>
                  <p className="text-gray-500">تعداد فصل‌ها</p>
                  <p className="text-white">{data.chapters.length}</p>
                </div>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed max-w-3xl">{data.description}</p>

            <div className="flex flex-wrap gap-3">
              {data.type === 'anime' && data.episodes && (
                <Link
                  to={`/watch/${data.id}`}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  تماشا
                </Link>
              )}
              {(data.type === 'manga' || data.type === 'manhwa') && data.chapters && (
                <Link
                  to={`/read/${data.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  خواندن
                </Link>
              )}
              <button
                onClick={() => addToFavorites(data)}
                className="border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFavorite(data.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {data.episodes && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">قسمت‌ها</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.episodes.map((episode) => (
              <Link
                key={episode.id}
                to={`/watch/${data.id}/${episode.id}`}
                className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg text-center transition-colors"
              >
                <p className="font-medium">قسمت {episode.number}</p>
                <p className="text-gray-400 text-sm mt-1">{episode.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data.chapters && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">فصل‌ها</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                to={`/read/${data.id}/${chapter.id}`}
                className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg text-center transition-colors"
              >
                <p className="font-medium">فصل {chapter.number}</p>
                <p className="text-gray-400 text-sm mt-1">{chapter.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ReviewSection contentId={data.id} />

      {data.related && data.related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">محتواهای مرتبط</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.related.slice(0, 6).map((item) => (
              <CardComponent key={item.id} {...item} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ContentDetail
