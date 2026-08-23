import { Outlet } from 'react-router-dom'
import { PageLoader } from '../Common/LoadingSpinner'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="text-2xl font-bold text-white">آنیمه‌پلاس</span>
        </div>
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
