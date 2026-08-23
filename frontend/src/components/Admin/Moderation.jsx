import { useState } from 'react'
import { motion } from 'framer-motion'
import { ContentLoader } from '../Common/LoadingSpinner'
import Modal from '../Shared/Modal'
import { useFetchContents } from '../../hooks/useContent'
import t from '../../utils/translations'

const Moderation = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      type: 'review',
      contentId: 1,
      contentTitle: 'انیمه نمونه',
      reporter: 'user1',
      reason: 'محتوای نامناسب',
      status: 'pending',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      type: 'content',
      contentId: 2,
      contentTitle: 'مانگا نمونه',
      reporter: 'user2',
      reason: 'کپی‌رایت',
      status: 'pending',
      createdAt: '2024-01-14',
    },
  ])
  const [selectedReport, setSelectedReport] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: contents } = useFetchContents()

  const handleAction = (reportId, action) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, status: action } : report
      )
    )
    setIsModalOpen(false)
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      approved: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400',
    }
    return badges[status] || badges.pending
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'در انتظار بررسی',
      approved: 'تایید شده',
      rejected: 'رد شده',
    }
    return texts[status] || status
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">نظارت و مدیریت</h1>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-right text-gray-400 font-medium px-6 py-3">نوع گزارش</th>
                <th className="text-right text-gray-400 font-medium px-6 py-3">محتوا</th>
                <th className="text-right text-gray-400 font-medium px-6 py-3">گزارش دهنده</th>
                <th className="text-right text-gray-400 font-medium px-6 py-3">دلیل</th>
                <th className="text-right text-gray-400 font-medium px-6 py-3">وضعیت</th>
                <th className="text-right text-gray-400 font-medium px-6 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-gray-300">
                    {report.type === 'review' ? 'نظر' : 'محتوا'}
                  </td>
                  <td className="px-6 py-4 text-white">{report.contentTitle}</td>
                  <td className="px-6 py-4 text-gray-300">{report.reporter}</td>
                  <td className="px-6 py-4 text-gray-300">{report.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(report.status)}`}>
                      {getStatusText(report.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {report.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedReport(report)
                            setIsModalOpen(true)
                          }}
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          بررسی
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="بررسی گزارش"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">محتوا</p>
              <p className="text-white">{selectedReport.contentTitle}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">دلیل گزارش</p>
              <p className="text-white">{selectedReport.reason}</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => handleAction(selectedReport.id, 'rejected')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                حذف محتوا
              </button>
              <button
                onClick={() => handleAction(selectedReport.id, 'approved')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                رد گزارش
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

export default Moderation
