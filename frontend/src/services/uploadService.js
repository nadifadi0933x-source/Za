import api from './api'

const UPLOAD_ENDPOINT = '/upload'

class UploadService {
  async uploadImage(file, folder = 'general') {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)
    
    return api.postFormData(`${UPLOAD_ENDPOINT}/image`, formData)
  }

  async uploadVideo(file, folder = 'videos') {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('folder', folder)
    
    return api.postFormData(`${UPLOAD_ENDPOINT}/video`, formData)
  }

  async uploadSubtitle(file) {
    const formData = new FormData()
    formData.append('subtitle', file)
    
    return api.postFormData(`${UPLOAD_ENDPOINT}/subtitle`, formData)
  }

  async uploadMultipleImages(files, folder = 'general') {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })
    formData.append('folder', folder)
    
    return api.postFormData(`${UPLOAD_ENDPOINT}/images`, formData)
  }

  async deleteFile(filename) {
    return api.delete(`${UPLOAD_ENDPOINT}/file`, { data: { filename } })
  }

  async getUploadUrl(filename) {
    return api.get(`${UPLOAD_ENDPOINT}/url/${filename}`)
  }

  async validateFile(file, options = {}) {
    const { maxSize = 50 * 1024 * 1024, allowedTypes = ['image/*', 'video/*'] } = options
    
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`)
    }
    
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'))
      }
      return file.type === type
    })
    
    if (!isValidType) {
      throw new Error(`File type ${file.type} is not allowed`)
    }
    
    return true
  }
}

export default new UploadService()
