import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useUploadContent } from '../../hooks/useContent'
import useUIStore from '../../store/useUIStore'
import { CONTENT_TYPES } from '../../utils/constants'

const UploadManager = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'anime',
    description: '',
    genres: '',
    releaseYear: new Date().getFullYear(),
    status: 'upcoming',
  })
  const [files, setFiles] = useState({
    coverImage: null,
    bannerImage: null,
    video: null,
    pages: [],
  })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const uploadContent = useUploadContent()
  const { addNotification } = useUIStore()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      setFiles((prev) => ({ ...prev, coverImage: droppedFiles[0] }))
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) {
      setFiles((prev) => ({ ...prev, coverImage: selectedFiles[0] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('type', formData.type)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('genres', formData.genres)
    formDataToSend.append('releaseYear', formData.releaseYear)
    formDataToSend.append('status', formData.status)

    if (files.coverImage) {
      formDataToSend.append('coverImage', files.coverImage)
    }
    if (files.bannerImage) {
      formDataToSend.append('bannerImage', files.bannerImage)
    }
    if (files.video) {
      formDataToSend.append('video', files.video)
    }
    files.pages.forEach((page) => {
      formDataToSend.append('pages', page)
    })

    try {
      await uploadContent.mutateAsync(formDataToSend)
      addNotification({ type: 'success', message: 'محتوا با موفقیت آپلود شد' })
      setFormData({
        title: '',
        type: 'anime',
        description: '',
        genres: '',
        releaseYear: new Date().getFullYear(),
        status: 'upcoming',
      })
      setFiles({ coverImage: null, bannerImage: null, video: null, pages: [] })
    } catch {
      addNotification({ type: 'error', message: 'خطا در آپلود محتوا' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">آپلود محتوا</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">عنوان</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">نوع محتوا</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              {CONTENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">وضعیت</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="ongoing">در حال پخش</option>
              <option value="completed">تکمیل شده</option>
              <option value="upcoming">به زودی</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">توضیحات</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ژانرها (جدا شده با ویرگول)</label>
            <input
              type="text"
              value={formData.genres}
              onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">سال انتشار</label>
            <input
              type="number"
              value={formData.releaseYear}
              onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">تصویر کاور</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
          >
            {files.coverImage ? (
              <div>
                <img
                  src={URL.createObjectURL(files.coverImage)}
                  alt="Preview"
                  className="max-h-40 mx-auto rounded-lg mb-2"
                />
                <p className="text-gray-400 text-sm">{files.coverImage.name}</p>
              </div>
            ) : (
              <div>
                <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400">فایل را اینجا رها کنید یا کلیک کنید</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            لغو
          </button>
          <button
            type="submit"
            disabled={uploadContent.isPending}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {uploadContent.isPending ? 'در حال آپلود...' : 'آپلود'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default UploadManager
