import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFetchContents } from '../hooks/useContent'
import ContentGrid from '../components/Content/ContentGrid'
import Pagination from '../components/Shared/Pagination'
import { SORT_OPTIONS, PAGINATION_LIMIT } from '../utils/constants'

const Anime = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState('popularity')

  const { data, isLoading } = useFetchContents({
    type: 'anime',
    sort,
    page: currentPage,
    limit: PAGINATION_LIMIT,
  })

  const totalPages = data?.pagination?.totalPages || 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">انیمه‌ها</h1>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value)
            setCurrentPage(1)
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ContentGrid contents={data?.contents || []} type="anime" loading={isLoading} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </motion.div>
  )
}

export default Anime
