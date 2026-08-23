export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export function setToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
}

export function removeToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refresh_token')
}

export function setRefreshToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem('refresh_token', token)
}

export function removeRefreshToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('refresh_token')
}

export function isAuthenticated() {
  return !!getToken()
}

export function handleApiError(error) {
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return data.message || 'درخواست نامعتبر است'
      case 401:
        return 'لطفاً ابتدا وارد شوید'
      case 403:
        return 'شما دسترسی لازم را ندارید'
      case 404:
        return 'منبع یافت نشد'
      case 409:
        return data.message || 'درخواست با وضعیت فعلی در تضاد است'
      case 422:
        return data.errors ? Object.values(data.errors).flat().join(', ') : 'داده‌های وارد شده نامعتبر است'
      case 429:
        return 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید'
      case 500:
        return 'خطای داخلی سرور. لطفاً بعداً تلاش کنید'
      case 503:
        return 'سرویس در حال حاضر در دسترس نیست'
      default:
        return data.message || 'خطای نامعلوم رخ داده است'
    }
  } else if (error.request) {
    return 'خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید'
  } else {
    return 'خطایی رخ داده است. لطفاً دوباره تلاش کنید'
  }
}

export function extractErrorMessage(error) {
  if (typeof error === 'string') return error
  
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error?.message) {
    return error.message
  }
  
  return 'خطای نامعلوم'
}
