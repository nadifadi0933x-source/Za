import { Outlet } from 'react-router-dom'
import Header from '../Common/Header'
import Sidebar from '../Common/Sidebar'
import Footer from '../Common/Footer'
import { PageLoader } from '../Common/LoadingSpinner'
import useAuthStore from '../../store/useAuthStore'

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 lg:mr-64">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
