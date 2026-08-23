# مستندات API

این سند APIهای بک‌اند پروژه آنیمه‌پلاس را توضیح می‌دهد.

## پایه

تمام درخواست‌ها باید هدر `Content-Type: application/json` را داشته باشند.

برای درخواست‌های نیازمند احراز هویت، توکن JWT در هدر زیر ارسال شود:

```
Authorization: Bearer <token>
```

## Base URL

```
http://localhost:5000/api
```

## احراز هویت

### ثبت نام

```
POST /auth/register
```

**درخواست:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**پاسخ:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user",
    "createdAt": "string"
  },
  "token": "string"
}
```

### ورود

```
POST /auth/login
```

**درخواست:**
```json
{
  "email": "string",
  "password": "string"
}
```

**پاسخ:**
```json
{
  "user": { ... },
  "token": "string"
}
```

## محتوا

### دریافت لیست محتوا

```
GET /contents
```

**پارامترهای کوئری:**
| پارامتر | نوع | توضیحات |
|---------|-----|---------|
| type | string | نوع محتوا (anime, manga, manhwa) |
| genre | string | ژانر |
| sort | string | مرتب‌سازی (popularity, rating, newest) |
| page | number | شماره صفحه |
| limit | number | تعداد در هر صفحه |
| search | string | متن جستجو |

**پاسخ:**
```json
{
  "contents": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200
  }
}
```

### دریافت محتوای خاص

```
GET /contents/:id
```

### جستجو

```
GET /search?q=:query
```

## کاربر

### پروفایل کاربر

```
GET /user/profile
```

### به‌روزرسانی پروفایل

```
PUT /user/profile
```

### علاقه‌مندی‌ها

```
GET /user/favorites
POST /user/favorites/:contentId
DELETE /user/favorites/:contentId
```

### تاریخچه تماشا

```
GET /user/history
```

### نشانک‌ها

```
GET /user/bookmarks
POST /user/bookmarks
DELETE /user/bookmarks/:contentId
```

## نظرات

### دریافت نظرات محتوا

```
GET /reviews?contentId=:id
```

### ارسال نظر

```
POST /reviews
```

**درخواست:**
```json
{
  "contentId": "string",
  "rating": 5,
  "comment": "string"
}
```

## مدیریت (Admin)

### آپلود محتوا

```
POST /admin/upload
```

محتوا به صورت multipart/form-data ارسال می‌شود.

### آمار

```
GET /admin/analytics
```

**پاسخ:**
```json
{
  "totalUsers": 1000,
  "totalContents": 500,
  "totalViews": 100000,
  "activeUsers": 200,
  "viewsOverTime": [...],
  "topContent": [...],
  "genreStats": [...]
}
```

### مدیریت کاربران

```
GET /admin/users
PUT /admin/users/:id/role
```

## کدهای وضعیت

| کد | توضیحات |
|----|---------|
| 200 | موفق |
| 201 | ایجاد شده |
| 400 | درخواست نامعتبر |
| 401 | عدم احراز هویت |
| 403 | عدم دسترسی |
| 404 | پیدا نشد |
| 500 | خطای سرور |

## خطاها

```json
{
  "message": "string",
  "errors": ["string"]
}
```
