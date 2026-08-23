import axios from '../utils/axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  get(endpoint, config = {}) {
    return axios.get(`${this.baseURL}${endpoint}`, config)
  }

  post(endpoint, data, config = {}) {
    return axios.post(`${this.baseURL}${endpoint}`, data, config)
  }

  put(endpoint, data, config = {}) {
    return axios.put(`${this.baseURL}${endpoint}`, data, config)
  }

  patch(endpoint, data, config = {}) {
    return axios.patch(`${this.baseURL}${endpoint}`, data, config)
  }

  delete(endpoint, config = {}) {
    return axios.delete(`${this.baseURL}${endpoint}`, config)
  }

  getWithParams(endpoint, params) {
    return this.get(endpoint, { params })
  }

  postFormData(endpoint, formData, config = {}) {
    return axios.post(`${this.baseURL}${endpoint}`, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  putFormData(endpoint, formData, config = {}) {
    return axios.put(`${this.baseURL}${endpoint}`, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  download(endpoint, filename) {
    return axios.get(`${this.baseURL}${endpoint}`, {
      responseType: 'blob',
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    })
  }
}

export default new ApiService()
