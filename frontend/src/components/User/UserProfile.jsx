import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUserProfile, useUpdateProfile } from '../../hooks/useAuth'
import useAuthStore from '../../store/useAuthStore'
import useUIStore from '../../store/useUIStore'
import { ContentLoader } from '../Common/LoadingSpinner'
import t from '../../utils/translations'

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
  })
  const { user } = useAuthStore()
  const { data: profile, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()
  const { addNotification } = useUIStore()

  if (isLoading) {
    return <ContentLoader />
  }

  const profileData = profile || user

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync(formData)
      addNotification({ type: 'success', message: 'پروفایل با موفقیت به‌روزرسانی شد' })
      setIsEditing(false)
    } catch {
      addNotification({ type: 'error', message: 'خطا در به‌روزرسانی پروفایل' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t.profile}</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            {isEditing ? 'لغو' : t.edit}
          </button>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <img
              src={profileData?.avatar || '/default-avatar.png'}
              alt={profileData?.username}
              className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
            />
          </div>

          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t.username}
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    بیوگرافی
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {t.save}
                </button>
              </form>
            ) : (
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">{profileData?.username}</h2>
                <p className="text-gray-400">{profileData?.email}</p>
                {profileData?.bio && <p className="text-gray-300 mt-2">{profileData.bio}</p>}
                <p className="text-gray-500 text-sm mt-4">
                  عضو از {new Date(profileData?.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UserProfile
