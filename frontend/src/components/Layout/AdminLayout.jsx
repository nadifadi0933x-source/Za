import { Outlet } from 'react-router-dom'
import Sidebar from '../Common/Sidebar'
import { PageLoader } from '../Common/LoadingSpinner'
import useAuthStore from '../../store/useAuthStore'

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || user?.role !== 'admin') {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-lg font-bold">پنل مدیریت</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">خوش آمدید، {user?.username}</span>
        </div>
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 lg:mr-64">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
