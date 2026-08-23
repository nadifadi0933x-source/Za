import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFetchContents } from '../../hooks/useContent'
import { ContentLoader } from '../Common/LoadingSpinner'
import { useContentStore } from '../../store/useContentStore'
import ContentGrid from '../Content/ContentGrid'
import { CONTENT_TYPES, GENRES, SORT_OPTIONS } from '../../utils/constants'
import Modal from '../Shared/Modal'
import { classNames } from '../../utils/helpers'

const ContentManagement = () => {
  const [filters, setFilters] = useState({
    type: 'all',
    genre: 'all',
    sort: 'popularity',
    search: '',
  })
  const [selectedContent, setSelectedContent] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { data, isLoading } = useFetchContents(filters)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleDelete = () => {
    useContentStore.getState().removeFromFavorites(selectedContent?.id)
    setIsDeleteModalOpen(false)
    setSelectedContent(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">مدیریت محتوا</h1>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            <option value="all">همه</option>
            {CONTENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            <option value="all">همه ژانرها</option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="جستجو..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 flex-1 min-w-[200px]"
          />
        </div>
      </div>

      {isLoading ? (
        <ContentLoader />
      ) : (
        <ContentGrid contents={data?.contents || []} type={filters.type} loading={isLoading} />
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="حذف محتوا"
      >
        <div className="space-y-4">
          <p className="text-gray-300">آیا از حذف این محتوا اطمینان دارید؟</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              لغو
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              حذف
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}

export default ContentManagement
