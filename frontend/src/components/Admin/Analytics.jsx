import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFetchAnalytics } from '../../hooks/useContent'
import { ContentLoader } from '../Common/LoadingSpinner'
import { formatNumber } from '../../utils/helpers'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const { data: analytics, isLoading } = useFetchAnalytics()

  if (isLoading) {
    return <ContentLoader />
  }

  const data = analytics || {
    viewsOverTime: [],
    topContent: [],
    userGrowth: [],
    genreStats: [],
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">آمار و تحلیل</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
        >
          <option value="7d">7 روز گذشته</option>
          <option value="30d">30 روز گذشته</option>
          <option value="90d">90 روز گذشته</option>
          <option value="1y">یک سال گذشته</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">بازدید کل</p>
          <p className="text-3xl font-bold text-white mt-2">{formatNumber(data.totalViews || 0)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">کاربران فعال</p>
          <p className="text-3xl font-bold text-white mt-2">{formatNumber(data.activeUsers || 0)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">میانگین زمان تماشا</p>
          <p className="text-3xl font-bold text-white mt-2">{data.avgWatchTime || 0} دقیقه</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">نرخ بازگشت</p>
          <p className="text-3xl font-bold text-white mt-2">{(data.retentionRate || 0).toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">محتوای پربازدید</h2>
          <div className="space-y-3">
            {(data.topContent || []).map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-6">{index + 1}</span>
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-10 h-14 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{item.title}</p>
                  <p className="text-gray-400 text-xs">
                    {formatNumber(item.views)} بازدید
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">آمار ژانرها</h2>
          <div className="space-y-3">
            {(data.genreStats || []).map((genre) => (
              <div key={genre.name} className="flex items-center gap-3">
                <span className="text-gray-300 text-sm w-20 truncate">{genre.name}</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${genre.percentage}%` }}
                  />
                </div>
                <span className="text-gray-400 text-sm">{genre.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Analytics
