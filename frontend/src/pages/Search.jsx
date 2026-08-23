import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSearchContents } from '../hooks/useContent'
import ContentGrid from '../components/Content/ContentGrid'
import Pagination from '../components/Shared/Pagination'
import { ContentLoader } from '../components/Common/LoadingSpinner'
import SearchBar from '../components/Common/SearchBar'
import { PAGINATION_LIMIT } from '../utils/constants'
import { useContentStore } from '../store/useContentStore'
import { getContentTypeLabel } from '../utils/helpers'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedType, setSelectedType] = useState('all')

  const { data, isLoading } = useSearchContents(query)
  const { setCurrentContent } = useContentStore()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [query])

  let results = data?.results || []
  if (selectedType !== 'all') {
    results = results.filter((item) => item.type === selectedType)
  }

  const totalPages = Math.ceil(results.length / PAGINATION_LIMIT)
  const paginatedResults = results.slice(
    (currentPage - 1) * PAGINATION_LIMIT,
    currentPage * PAGINATION_LIMIT
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-6">جستجو</h1>
        <SearchBar />
        {query && (
          <p className="text-gray-400 text-center mt-4">
            نتایج جستجو برای: <span className="text-white">{query}</span>
          </p>
        )}
      </div>

      {selectedType !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">فیلتر:</span>
          <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
            {getContentTypeLabel(selectedType)}
          </span>
        </div>
      )}

      {isLoading ? (
        <ContentLoader />
      ) : query ? (
        <>
          <ContentGrid
            contents={paginatedResults}
            type={selectedType}
            loading={isLoading}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-400">عبارتی را برای جستجو وارد کنید</p>
        </div>
      )}
    </motion.div>
  )
}

export default Search
