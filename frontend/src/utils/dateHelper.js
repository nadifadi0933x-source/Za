export function formatDate(date, options = {}) {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const { format = 'gregorian', locale = 'fa-IR' } = options
  
  if (format === 'jalali') {
    return toJalali(d, locale)
  }
  
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

export function formatDateTime(date, options = {}) {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const { format = 'gregorian', locale = 'fa-IR' } = options
  
  if (format === 'jalali') {
    const datePart = toJalali(d, locale)
    const timePart = d.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    })
    return `${datePart} - ${timePart}`
  }
  
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  })
}

export function formatTime(date) {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  return d.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '۰۰:۰۰'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  const pad = (num) => String(num).padStart(2, '۰').replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])
  
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  }
  
  return `${pad(minutes)}:${pad(secs)}`
}

export function formatNumber(num) {
  if (num === null || num === undefined) return ''
  
  return new Intl.NumberFormat('fa-IR').format(num)
}

export function toJalali(date, locale = 'fa-IR') {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const persianDigits = (str) => str.replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])
  
  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ]
  
  const gy = d.getFullYear()
  const gm = d.getMonth() + 1
  const gd = d.getDate()
  
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  
  let jy = (gy <= 1600) ? 0 : 979
  let gy2 = (gy <= 1600) ? 1600 : gy
  let gm2 = gm - 1
  
  let g_day_no = 365 * gy2 + Math.floor((gy2 + 1) / 4) - Math.floor((gy2 + 1) / 100) + Math.floor((gy2 + 1) / 400) + gd + g_d_m[gm2]
  let j_day_no = g_day_no - 79
  let j_np = Math.floor(j_day_no / 12053)
  j_day_no = j_day_no % 12053
  jy += j_np * 33
  
  if (j_day_no >= 10995) {
    jy += Math.floor((j_day_no - 1) / 365)
    j_day_no = (j_day_no - 1) % 365
  }
  
  const jy2 = jy + 1
  const leap = Math.floor(((jy2 + 1) % 33 - 1) / 4)
  
  if (leap === 1 && j_day_no >= 79) {
    j_day_no -= 1
  }
  
  const j_month_no = j_day_no < 186 ? Math.floor(j_day_no / 31) : Math.floor((j_day_no - 6) / 30)
  const j_day = j_day_no < 186 ? (j_day_no % 31) + 1 : ((j_day_no - 186) % 30) + 1
  const j_month = j_month_no < 6 ? j_month_no + 1 : j_month_no - 5
  
  return persianDigits(`${jy} ${months[j_month - 1]} ${j_day}`)
}

export function getRelativeTime(date) {
  if (!date) return ''
  
  const now = new Date()
  const d = new Date(date)
  const diff = now - d
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (seconds < 60) return 'همین حالا'
  if (minutes < 60) return `${minutes} دقیقه قبل`
  if (hours < 24) return `${hours} ساعت قبل`
  if (days < 30) return `${days} روز قبل`
  if (months < 12) return `${months} ماه قبل`
  return `${years} سال قبل`
}

export function isToday(date) {
  if (!date) return false
  
  const d = new Date(date)
  const today = new Date()
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear()
}

export function isThisWeek(date) {
  if (!date) return false
  
  const d = new Date(date)
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  return d >= weekAgo && d <= today
}
