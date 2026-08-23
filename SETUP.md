# راهنمای راه‌اندازی

این راهنما مراحل نصب و راه‌اندازی پروژه آنیمه‌پلاس را توضیح می‌دهد.

## پیش‌نیازها

- Node.js 18+
- npm یا yarn
- Git

## مراحل نصب

### 1. کلون کردن مخزن

```bash
git clone <repository-url>
cd anime-plus
```

### 2. نصب وابستگی‌های بک‌اند

```bash
cd backend
npm install
cp .env.example .env
# فایل .env را بر اساس نیازهای خود تنظیم کنید
npm run dev
```

### 3. نصب وابستگی‌های فرانت‌اند

در ترمینال جداگانه:

```bash
cd frontend
npm install
cp .env.example .env.local
# فایل .env.local را بر اساس نیازهای خود تنظیم کنید
npm run dev
```

## تنظیمات محیطی

### بک‌اند (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anime-plus
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### فرانت‌اند (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:5173
```

## پایگاه داده

پروژه از MongoDB استفاده می‌کند. برای راه‌اندازی پایگاه داده:

### با Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### یا نصب محلی MongoDB

[MongoDB Community Edition](https://www.mongodb.com/try/download/community) را نصب کنید.

## ساختار پروژه

```
anime-plus/
├── backend/
│   ├── src/
│   │   ├── models/         # مدل‌های MongoDB
│   │   ├── routes/         # مسیرهای API
│   │   ├── controllers/    # کنترلرها
│   │   ├── middleware/     # میان‌افزارها
│   │   └── utils/          # ابزارهای کمکی
│   └── package.json
└── frontend/
    └── ...
```

## مشکلات رایج

### مشکل در اتصال به دیتابیس

```bash
# بررسی سرویس MongoDB
sudo systemctl status mongod
# یا
docker ps | grep mongodb
```

### مشکل در پورت‌ها

```bash
# بررسی پورت‌های در حال استفاده
lsof -i :5000
lsof -i :5173
```

## پشتیبانی

در صورت بروز مشکل، لطفاً issue در GitHub ایجاد کنید.
