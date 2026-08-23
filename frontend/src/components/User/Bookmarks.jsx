import { motion } from 'framer-motion'
import { useContentStore } from '../../store/useContentStore'
import { ContentLoader } from '../Common/LoadingSpinner'
import t from '../../utils/translations'

const Bookmarks = () => {
  const { bookmarks } = useContentStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">{t.bookmarks}</h1>

      {!bookmarks || bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <p className="text-gray-400">هنوز نشانکی ندارید</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <motion.div
              key={`${bookmark.content.id}-${bookmark.episode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4"
            >
              <img
                src={bookmark.content.coverImage}
                alt={bookmark.content.title}
                className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{bookmark.content.title}</h3>
                <p className="text-gray-400 text-sm">
                  {bookmark.episode ? `قسمت ${bookmark.episode}` : 'محتوا'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  نشانک شده در {new Date(bookmark.bookmarkedAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default Bookmarks
