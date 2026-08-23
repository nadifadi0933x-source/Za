import useAuthStore from '../store/useAuthStore'
import useUIStore from '../store/useUIStore'

export const isAuthenticated = () => useAuthStore.getState().isAuthenticated

export const getUser = () => useAuthStore.getState().user

export const getToken = () => useAuthStore.getState().token

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours} ساعت و ${mins} دقیقه`
  }
  return `${mins} دقیقه`
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('fa-IR').format(num)
}

export const getContentTypeLabel = (type) => {
  const labels = {
    anime: 'انیمه',
    manga: 'مانگا',
    manhwa: 'مانها',
  }
  return labels[type] || type
}

export const getStatusLabel = (status) => {
  const labels = {
    ongoing: 'در حال پخش',
    completed: 'تکمیل شده',
    upcoming: 'به زودی',
  }
  return labels[status] || status
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
