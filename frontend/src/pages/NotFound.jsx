import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
    >
      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl font-bold text-gray-500">404</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">صفحه پیدا نشد</h1>
      <p className="text-gray-400 mb-8 max-w-md">
        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
      </p>
      <Link
        to="/"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        بازگشت به صفحه اصلی
      </Link>
    </motion.div>
  )
}

export default NotFound
