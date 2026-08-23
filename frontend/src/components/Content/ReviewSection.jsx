import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCreateReview, useFetchContent } from '../../hooks/useContent'
import useAuthStore from '../../store/useAuthStore'
import RatingStars from './RatingStars'
import { formatDate } from '../../utils/helpers'
import { ContentLoader } from '../Common/LoadingSpinner'

const ReviewSection = ({ contentId }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const { isAuthenticated } = useAuthStore()
  const { data: content } = useFetchContent(contentId)
  const createReview = useCreateReview()

  if (!content) {
    return <ContentLoader />
  }

  const reviews = content.reviews || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return
    try {
      await createReview.mutateAsync({ contentId, rating, comment })
      setRating(5)
      setComment('')
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">نظرات</h2>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">امتیاز شما</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
              نظر شما
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="نظر خود را بنویسید..."
            />
          </div>

          <button
            type="submit"
            disabled={createReview.isPending}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {createReview.isPending ? 'در حال ثبت...' : 'ثبت نظر'}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">هنوز نظری ثبت نشده</p>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={review.user?.avatar || '/default-avatar.png'}
                    alt={review.user?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">{review.user?.username}</p>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{formatDate(review.createdAt)}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewSection
