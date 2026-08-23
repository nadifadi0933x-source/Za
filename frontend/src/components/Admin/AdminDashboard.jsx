import { motion } from 'framer-motion'
import { useFetchAnalytics } from '../../hooks/useContent'
import { ContentLoader } from '../Common/LoadingSpinner'
import { formatNumber } from '../../utils/helpers'

const AdminDashboard = () => {
  const { data: analytics, isLoading } = useFetchAnalytics()

  if (isLoading) {
    return <ContentLoader />
  }

  const stats = analytics || {
    totalUsers: 0,
    totalContents: 0,
    totalViews: 0,
    totalReviews: 0,
    newUsersThisMonth: 0,
    newContentsThisMonth: 0,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">داشبورد مدیریت</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">کل کاربران</p>
              <p className="text-3xl font-bold text-white mt-1">{formatNumber(stats.totalUsers)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 014 4V7a4 4 0 01-4 4H8a4 4 0 01-4-4v-.646a4 4 0 014-4h4z" />
              </svg>
            </div>
          </div>
          <p className="text-green-400 text-sm mt-2">+{formatNumber(stats.newUsersThisMonth)} این ماه</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">کل محتوا</p>
              <p className="text-3xl font-bold text-white mt-1">{formatNumber(stats.totalContents)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-green-400 text-sm mt-2">+{formatNumber(stats.newContentsThisMonth)} این ماه</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">کل بازدیدها</p>
              <p className="text-3xl font-bold text-white mt-1">{formatNumber(stats.totalViews)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">کل نظرات</p>
              <p className="text-3xl font-bold text-white mt-1">{formatNumber(stats.totalReviews)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminDashboard
