export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'ایمیل الزامی است'
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'فرمت ایمیل نامعتبر است'
  }
  
  return null
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'رمز عبور الزامی است'
  }
  
  if (password.length < 8) {
    return 'رمز عبور باید حداقل 8 کاراکتر باشد'
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد'
  }
  
  if (!/[a-z]/.test(password)) {
    return 'رمز عبور باید حداقل یک حرف کوچک انگلیسی داشته باشد'
  }
  
  if (!/[0-9]/.test(password)) {
    return 'رمز عبور باید حداقل یک عدد داشته باشد'
  }
  
  return null
}

export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return 'نام کاربری الزامی است'
  }
  
  if (username.length < 3) {
    return 'نام کاربری باید حداقل 3 کاراکتر باشد'
  }
  
  if (username.length > 30) {
    return 'نام کاربری نمی‌تواند بیش از 30 کاراکتر باشد'
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و خط زیر باشد'
  }
  
  return null
}

export function validateFullName(name) {
  if (!name || typeof name !== 'string') {
    return 'نام و نام خانوادگی الزامی است'
  }
  
  if (name.trim().length < 2) {
    return 'نام و نام خانوادگی باید حداقل 2 کاراکتر باشد'
  }
  
  if (name.length > 100) {
    return 'نام و نام خانوادگی نمی‌تواند بیش از 100 کاراکتر باشد'
  }
  
  return null
}

export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return null
  }
  
  try {
    new URL(url)
    return null
  } catch {
    return 'فرمت آدرس اینترنتی نامعتبر است'
  }
}

export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return 'شماره تلفن الزامی است'
  }
  
  const phoneRegex = /^(\+98|0)?9\d{9}$/
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'فرمت شماره تلفن نامعتبر است'
  }
  
  return null
}

export function validateRequired(value, fieldName = 'این فیلد') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} الزامی است`
  }
  
  return null
}

export function validateMinLength(value, min, fieldName = 'این فیلد') {
  if (!value || value.length < min) {
    return `${fieldName} باید حداقل ${min} کاراکتر باشد`
  }
  
  return null
}

export function validateMaxLength(value, max, fieldName = 'این فیلد') {
  if (value && value.length > max) {
    return `${fieldName} نمی‌تواند بیش از ${max} کاراکتر باشد`
  }
  
  return null
}

export function validateFileSize(file, maxSizeInMB) {
  if (!file) return 'فایل الزامی است'
  
  const maxSize = maxSizeInMB * 1024 * 1024
  if (file.size > maxSize) {
    return `حجم فایل نمی‌تواند بیش از ${maxSizeInMB} مگابایت باشد`
  }
  
  return null
}

export function validateFileType(file, allowedTypes) {
  if (!file) return 'فایل الزامی است'
  
  const fileType = file.type || ''
  const fileName = file.name || ''
  
  const isAllowed = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return fileType.startsWith(type.replace('/*', '/'))
    }
    return fileType === type || fileName.endsWith(type.replace('image/', '.').replace('video/', '.'))
  })
  
  if (!isAllowed) {
    return `فرمت فایل مجاز نیست. فرمت‌های مجاز: ${allowedTypes.join(', ')}`
  }
  
  return null
}

export function validateMatch(value1, value2, fieldName = 'مقادیر') {
  if (value1 !== value2) {
    return `${fieldName} مطابقت ندارند`
  }
  
  return null
}

export function validateRange(value, min, max, fieldName = 'مقدار') {
  if (value < min || value > max) {
    return `${fieldName} باید بین ${min} تا ${max} باشد`
  }
  
  return null
}

export function validatePositiveNumber(value, fieldName = 'عدد') {
  if (isNaN(value) || value <= 0) {
    return `${fieldName} باید یک عدد مثبت باشد`
  }
  
  return null
}

export function validateInteger(value, fieldName = 'عدد') {
  if (!Number.isInteger(Number(value))) {
    return `${fieldName} باید یک عدد صحیح باشد`
  }
  
  return null
}

export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return 'رمزهای عبور مطابقت ندارند'
  }
  
  return null
}
