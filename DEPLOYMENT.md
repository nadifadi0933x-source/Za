# راهنمای استقرار

این سند مراحل استقرار پروژه آنیمه‌پلاس در محیط تولید را توضیح می‌دهد.

## فهرست مطالب

1. [نیازمندی‌های سیستم](#نیازمندیهای-سیستم)
2. [استقرار بک‌اند](#استقرار-بک‌اند)
3. [استقرار فرانت‌اند](#استقرار-فرانت‌اند)
4. [تنظیمات Nginx](#تنظیمات-nginx)
5. [استقرار با Docker](#استقرار-با-docker)
6. [نظارت و مانیتورینگ](#نظارت-و-مانیتورینگ)

## نیازمندی‌های سیستم

- **CPU:** 2 هسته یا بیشتر
- **RAM:** 4GB یا بیشتر
- **Disk:** 20GB فضای خالی
- **OS:** Ubuntu 20.04+ یا مشابه

## استقرار بک‌اند

### 1. کلون کردن و نصب

```bash
git clone <repository-url>
cd anime-plus/backend
npm install --production
```

### 2. تنظیم متغیرهای محیطی

```bash
cp .env.example .env
# ویرایش فایل .env
nano .env
```

### 3. ساخت سرویس Systemd

```bash
sudo nano /etc/systemd/system/anime-plus-backend.service
```

```ini
[Unit]
Description=Anime Plus Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/anime-plus/backend
ExecStart=/usr/bin/node src/index.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable anime-plus-backend
sudo systemctl start anime-plus-backend
```

## استقرار فرانت‌اند

### 1. بیلد فرانت‌اند

```bash
cd anime-plus/frontend
npm install
npm run build
```

### 2. کپی فایل‌های بیلد

```bash
sudo mkdir -p /var/www/anime-plus
sudo cp -r dist/* /var/www/anime-plus/
```

## تنظیمات Nginx

```bash
sudo nano /etc/nginx/sites-available/anime-plus
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # فرانت‌اند
    root /var/www/anime-plus;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # بک‌اند API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # آپلودها
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }

    # کش استاتیک
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/anime-plus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## استقرار با Docker

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/anime-plus?authSource=admin
      JWT_SECRET: your_jwt_secret
    depends_on:
      - mongodb
    volumes:
      - ./uploads:/app/uploads

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Dockerfile بک‌اند

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "src/index.js"]
```

### Dockerfile فرانت‌اند

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker-compose up -d
```

## SSL/TLS

```bash
sudo certbot --nginx -d your-domain.com
```

## نظارت و مانیتورینگ

### PM2 (برای بک‌اند)

```bash
npm install -g pm2
pm2 start src/index.js --name anime-plus-backend
pm2 startup
pm2 save
pm2 monit
```

### بررسی وضعیت

```bash
# بک‌اند
curl http://localhost:5000/api/health

# فرانت‌اند
curl http://your-domain.com
```

## بکاپ

```bash
# بکاپ MongoDB
mongodump --host localhost --db anime-plus --out /backup/anime-plus-$(date +%Y%m%d)

# بکاپ فایل‌های آپلود
tar -czf /backup/uploads-$(date +%Y%m%d).tar.gz /path/to/uploads
```

## عیب‌یابی

```bash
# مشاهده لاگ‌ها
sudo journalctl -u anime-plus-backend -f
sudo tail -f /var/log/nginx/error.log

# بررسی سرویس‌ها
sudo systemctl status anime-plus-backend
sudo systemctl status nginx
docker-compose logs
```
