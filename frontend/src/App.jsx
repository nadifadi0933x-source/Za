import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import MainLayout from './components/Layout/MainLayout'
import AdminLayout from './components/Layout/AdminLayout'
import AuthLayout from './components/Layout/AuthLayout'
import Home from './pages/Home'
import Anime from './pages/Anime'
import Manga from './pages/Manga'
import Manhwa from './pages/Manhwa'
import AnimeDetail from './pages/AnimeDetail'
import MangaDetail from './pages/MangaDetail'
import ManhowaDetail from './pages/ManhowaDetail'
import WatchAnime from './pages/WatchAnime'
import ReadManga from './pages/ReadManga'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import AdminDashboard from './components/Admin/AdminDashboard'
import ContentManagement from './components/Admin/ContentManagement'
import UserManagement from './components/Admin/UserManagement'

function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/anime" element={<MainLayout><Anime /></MainLayout>} />
      <Route path="/manga" element={<MainLayout><Manga /></MainLayout>} />
      <Route path="/manhwa" element={<MainLayout><Manhwa /></MainLayout>} />
      <Route path="/anime/:id" element={<MainLayout><AnimeDetail /></MainLayout>} />
      <Route path="/manga/:id" element={<MainLayout><MangaDetail /></MainLayout>} />
      <Route path="/manhwa/:id" element={<MainLayout><ManhowaDetail /></MainLayout>} />
      <Route path="/watch/:id" element={<MainLayout><WatchAnime /></MainLayout>} />
      <Route path="/read/:id" element={<MainLayout><ReadManga /></MainLayout>} />
      <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/content" element={
        <ProtectedRoute roles={['admin']}>
          <AdminLayout><ContentManagement /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin']}>
          <AdminLayout><UserManagement /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  )
}

export default App
