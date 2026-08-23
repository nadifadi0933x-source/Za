import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFetchContents } from '../hooks/useContent'
import ContentGrid from '../components/Content/ContentGrid'
import Pagination from '../components/Shared/Pagination'
import { GENRES, SORT_OPTIONS, PAGINATION_LIMIT } from '../utils/constants'
import { useContentStore } from '../store/useContentStore'
import { useUIStore } from '../store/useUIStore'
import { classNames } from '../utils/helpers'

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    type: 'all',
    genre: 'all',
    sort: 'popularity',
  })
  const { setCurrentContent } = useContentStore()
  const { addNotification } = useUIStore()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { data, isLoading } = useFetchContents({
    ...filters,
    page: currentPage,
    limit: PAGINATION_LIMIT,
  })

  const handleContentClick = (content) => {
    setCurrentContent(content)
  }

  const totalPages = data?.pagination?.totalPages || 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
        </div>
        <div className="relative p-8 md:p-12 min-h-[400px] flex flex-col justify-end">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            بهترین تجربه تماشای انیمه
          </h1>
          <p className="text-gray-300 text-lg mb-6 max-w-xl">
            هزاران انیمه، مانگا و مانها با زیرنویس فارسی و کیفیت بالا در انتظار شماست.
          </p>
          <div className="flex gap-3">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              شروع تماشا
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              مشاهده لیست
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">محتوای پیشنهادی</h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.type}
              onChange={(e) => {
                setFilters({ ...filters, type: e.target.value })
                setCurrentPage(1)
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="all">همه</option>
              <option value="anime">انیمه</option>
              <option value="manga">مانگا</option>
              <option value="manhwa">مانها</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ContentGrid
          contents={data?.contents || []}
          type={filters.type}
          loading={isLoading}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </motion.div>
  )
}

export default Home
