import api from './api'

const AUTH_ENDPOINT = '/auth'

class AuthService {
  async login(credentials) {
    const response = await api.post(`${AUTH_ENDPOINT}/login`, credentials)
    const { token, refreshToken, user } = response.data
    
    localStorage.setItem('auth_token', token)
    localStorage.setItem('refresh_token', refreshToken)
    
    return { ...response, data: { token, refreshToken, user } }
  }

  async register(userData) {
    const response = await api.post(`${AUTH_ENDPOINT}/register`, userData)
    const { token, refreshToken, user } = response.data
    
    localStorage.setItem('auth_token', token)
    localStorage.setItem('refresh_token', refreshToken)
    
    return { ...response, data: { token, refreshToken, user } }
  }

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token')
    
    try {
      await api.post(`${AUTH_ENDPOINT}/logout`, { refreshToken })
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
    }
  }

  async getCurrentUser() {
    return api.get(`${AUTH_ENDPOINT}/me`)
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await api.post(`${AUTH_ENDPOINT}/refresh`, { refreshToken })
    const { token, refreshToken: newRefreshToken } = response.data
    
    localStorage.setItem('auth_token', token)
    localStorage.setItem('refresh_token', newRefreshToken)
    
    return response.data
  }

  async forgotPassword(email) {
    return api.post(`${AUTH_ENDPOINT}/forgot-password`, { email })
  }

  async resetPassword(token, password) {
    return api.post(`${AUTH_ENDPOINT}/reset-password`, { token, password })
  }

  async verifyEmail(token) {
    return api.post(`${AUTH_ENDPOINT}/verify-email`, { token })
  }

  async updateProfile(userData) {
    return api.put(`${AUTH_ENDPOINT}/profile`, userData)
  }

  async changePassword(passwordData) {
    return api.put(`${AUTH_ENDPOINT}/password`, passwordData)
  }

  async deleteAccount() {
    return api.delete(`${AUTH_ENDPOINT}/account`)
  }
}

export default new AuthService()
