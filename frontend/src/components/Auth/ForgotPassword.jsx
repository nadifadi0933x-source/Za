import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useUIStore from '../../store/useUIStore'
import t from '../../utils/translations'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { addNotification } = useUIStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    addNotification({ type: 'success', message: 'لینک بازیابی رمز عبور ارسال شد' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white text-center mb-2">فراموشی رمز عبور</h2>
      <p className="text-gray-400 text-center mb-6">
        ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برایتان ارسال شود
      </p>

      {isSubmitted ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white mb-4">ایمیل بازیابی رمز عبور ارسال شد</p>
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            بازگشت به صفحه ورود
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="example@email.com"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
          >
            ارسال لینک بازیابی
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-400">
        <Link to="/login" className="text-purple-400 hover:text-purple-300">
          بازگشت به صفحه ورود
        </Link>
      </p>
    </motion.div>
  )
}

export default ForgotPassword
