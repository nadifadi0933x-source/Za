import { useState } from 'react'
import { motion } from 'framer-motion'
import useUIStore from '../../store/useUIStore'
import t from '../../utils/translations'

const UserSettings = () => {
  const { theme, setTheme, language, setLanguage, sidebarOpen, toggleSidebar } = useUIStore()
  const [settings, setSettings] = useState({
    notifications: true,
    autoplay: true,
    downloadQuality: '1080p',
  })

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">{t.settings}</h1>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">ظاهر</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">تم تاریک</p>
                <p className="text-gray-400 text-sm">استفاده از تم تاریک برای رابط کاربری</p>
              </div>
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
              >
                <option value="dark">تاریک</option>
                <option value="light">روشن</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">زبان</p>
                <p className="text-gray-400 text-sm">انتخاب زبان رابط کاربری</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
              >
                <option value="fa">فارسی</option>
                <option value="en">انگلیسی</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">نوار کناری</p>
                <p className="text-gray-400 text-sm">نمایش نوار کناری منو</p>
              </div>
              <button
                onClick={toggleSidebar}
                className={`w-12 h-6 rounded-full transition-colors ${
                  sidebarOpen ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    sidebarOpen ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">پخش</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">پخش خودکار قسمت بعدی</p>
                <p className="text-gray-400 text-sm">پخش خودکار قسمت بعدی پس از پایان قسمت</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, autoplay: !settings.autoplay })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.autoplay ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.autoplay ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">کیفیت پیش‌فرض</p>
                <p className="text-gray-400 text-sm">کیفیت پیش‌فرض برای پخش ویدیو</p>
              </div>
              <select
                value={settings.downloadQuality}
                onChange={(e) => setSettings({ ...settings, downloadQuality: e.target.value })}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
              >
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">اعلان‌ها</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">اعلان‌ها</p>
                <p className="text-gray-400 text-sm">دریافت اعلان‌های محتوای جدید</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UserSettings
