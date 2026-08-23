import { useState } from 'react'
import { motion } from 'framer-motion'
import { ContentLoader } from '../Common/LoadingSpinner'
import { useCurrentUser } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/useAuthStore'
import Modal from '../Shared/Modal'
import { classNames } from '../../utils/helpers'

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user: currentUser } = useAuthStore()
  const { data: users, isLoading } = useCurrentUser()

  if (isLoading) {
    return <ContentLoader />
  }

  const filteredUsers = (users || []).filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRoleChange = (userId, newRole) => {
    console.log('Change role for user', userId, 'to', newRole)
    setIsModalOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">مدیریت کاربران</h1>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <input
            type="text"
            placeholder="جستجوی کاربر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-right text-gray-400 font-medium px-6 py-3">کاربر</th>
                <th className="text-right text-gray-400 font-medium px-6 py-3">ایمیل</th>
                <th className="text-right text-gray-400 font-medium px-6 py-3">نقش</th>
                <th className="text-right text-gray-400 font-medium px-6 py-3">تاریخ ثبت</th>
                <th className="text-right text-gray-400 font-medium px-6 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={classNames(
                        'px-2 py-1 rounded-full text-xs',
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-gray-700 text-gray-300'
                      )}
                    >
                      {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setIsModalOpen(true)
                      }}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      ویرایش
                    </button>
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
        title={`ویرایش کاربر: ${selectedUser?.username}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">نقش</label>
            <select
              defaultValue={selectedUser?.role}
              onChange={(e) => handleRoleChange(selectedUser?.id, e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="user">کاربر</option>
              <option value="admin">مدیر</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              لغو
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ذخیره
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}

export default UserManagement
