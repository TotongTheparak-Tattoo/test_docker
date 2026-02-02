# Production Deployment Guide

## ⚠️ ข้อควรระวังสำคัญก่อน Deploy Production

### 1. Security Issues ที่ต้องแก้

❌ **ปัญหาปัจจุบัน:**
- Password hard-coded ใน `docker-compose.yml`
- JWT Secret และ sensitive data อยู่ในไฟล์ที่ commit ได้

✅ **ควรทำ:**
- ใช้ environment variables จากไฟล์ `.env` (ไม่ commit ใน git)
- เปลี่ยน passwords ทั้งหมดเป็นแบบที่แข็งแรง
- ใช้ Docker secrets สำหรับข้อมูลสำคัญ

---

## 📋 Checklist ก่อน Deploy Production

### ✅ Security Checklist

- [ ] เปลี่ยน SA Password ใน SQL Server
- [ ] เปลี่ยน JWT_SECRET ให้เป็นค่าที่ซับซ้อนและยาวกว่า
- [ ] สร้าง `.env` file (ไม่ commit ใน git)
- [ ] เพิ่ม `.env` ใน `.gitignore`
- [ ] ลบ password จาก `docker-compose.yml`
- [ ] เปิด SSL/TLS สำหรับ database connection
- [ ] ตั้งค่า firewall rules
- [ ] จำกัด ports ที่เปิด (ไม่ควรเปิด 1433 ออกภายนอก)

### ✅ Configuration Checklist

- [ ] ตั้งค่า `NODE_ENV=production`
- [ ] เปิด logging ที่เหมาะสม
- [ ] ตั้งค่า restart policy
- [ ] กำหนด resource limits (CPU, Memory)
- [ ] ตั้งค่า healthcheck
- [ ] Backup strategy

### ✅ Code Checklist

- [ ] ลบ seed script ออกหรือห้าม run ใน production
- [ ] ลบ test accounts
- [ ] ตั้งค่า CORS ให้เฉพาะ domains ที่อนุญาต
- [ ] เปิด rate limiting
- [ ] Log errors แต่ไม่แสดงรายละเอียดให้ client

---

## 🔧 การตั้งค่าสำหรับ Production

### 1. สร้างไฟล์ `.env` (Production)

```bash
# Database Configuration
DB_HOST=db
DB_USER=sa
DB_PASS=YourVeryStrongPasswordHere123!@#
DB_NAME=minebea_central_auth
DB_DIALECT=mssql

# Google OAuth
GOOGLE_CLIENT_ID=your-actual-client-id
GOOGLE_ALLOWED_DOMAIN=minebea.co.th

# JWT Configuration (ต้องเปลี่ยน!)
JWT_SECRET=your-super-complex-secret-key-min-32-characters-random-string-here
JWT_EXPIRES_IN=24h

# Server
PORT=6200
NODE_ENV=production

# SQL Server Password (ต้องเปลี่ยน!)
MSSQL_SA_PASSWORD=YourVeryStrongPasswordHere123!@#
```

### 2. อัปเดต `docker-compose.yml` สำหรับ Production

สร้างไฟล์ `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: minebea_auth_db
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=${MSSQL_SA_PASSWORD}
      - MSSQL_PID=Express
    ports:
      - "127.0.0.1:1433:1433"  # จำกัดให้เข้าถึงได้แค่ localhost
    volumes:
      - db_data:/var/opt/mssql
    networks:
      - auth_network
    healthcheck:
      test: /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -Q "SELECT 1" -C || exit 1
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  auth-service:
    build: .
    container_name: minebea-auth-service
    ports:
      - "6200:6200"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    networks:
      - auth_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:6200/api/auth/verify-token"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  db_data:
    driver: local

networks:
  auth_network:
    driver: bridge
```

### 3. อัปเดต `.gitignore`

```gitignore
# Environment files
.env
.env.production
.env.local

# Database
*.mdf
*.ldf

# Logs
logs/
*.log

# Docker
docker-compose.override.yml

# Node modules
node_modules/

# Backup files
backup/
*.bak
```

### 4. สร้าง Dockerfile ที่เหมาะสมกับ Production

```dockerfile
# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/src/app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 6200

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:6200', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]
```

---

## 🚀 คำสั่งสำหรับ Deploy Production

### Development (ใช้ docker-compose.yml ปกติ)

```bash
# Development - มี hot reload, debug mode
docker-compose up --build -d
```

### Production (ใช้ docker-compose.prod.yml)

```bash
# 1. สร้าง .env file ก่อน
cp env_config.txt .env
# แก้ไข .env ให้ใส่ค่าจริง

# 2. Build images
docker-compose -f docker-compose.prod.yml build

# 3. Start services (ครั้งแรก)
docker-compose -f docker-compose.prod.yml up -d

# 4. ตรวจสอบสถานะ
docker-compose -f docker-compose.prod.yml ps

# 5. ดู logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Update/Restart Production

```bash
# Pull latest code
git pull

# Rebuild and restart (ไม่ลบข้อมูล)
docker-compose -f docker-compose.prod.yml up --build -d

# หรือ Restart เฉพาะ service
docker-compose -f docker-compose.prod.yml restart auth-service
```

### Stop Production

```bash
# หยุดแต่ไม่ลบข้อมูล
docker-compose -f docker-compose.prod.yml down

# หยุดและลบ volumes (ระวัง! ข้อมูลหาย)
docker-compose -f docker-compose.prod.yml down -v
```

---

## 📊 Monitoring & Maintenance

### ตรวจสอบสถานะ

```bash
# ดู containers
docker ps

# ดู logs
docker logs minebea-auth-service --tail 100 -f

# ดูการใช้ resources
docker stats

# ตรวจสอบ health
docker inspect minebea-auth-service | grep -A 10 Health
```

### Backup Database

```bash
# Backup database
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C \
  -Q "BACKUP DATABASE minebea_central_auth TO DISK = '/var/opt/mssql/backup/auth_$(date +%Y%m%d_%H%M%S).bak'"

# Copy backup ออกมา
docker cp minebea_auth_db:/var/opt/mssql/backup/ ./backups/
```

### Restore Database

```bash
# Copy backup เข้าไป
docker cp ./backups/auth_20260202.bak minebea_auth_db:/var/opt/mssql/backup/

# Restore
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C \
  -Q "RESTORE DATABASE minebea_central_auth FROM DISK = '/var/opt/mssql/backup/auth_20260202.bak' WITH REPLACE"
```

---

## 🔒 Security Best Practices

### 1. ใช้ Docker Secrets (แนะนำสำหรับ Production)

```yaml
# docker-compose.prod.yml with secrets
secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt

services:
  auth-service:
    secrets:
      - db_password
      - jwt_secret
```

### 2. Reverse Proxy (Nginx)

```bash
# ใช้ Nginx เป็น reverse proxy
# อย่าเปิด port 6200 ออกภายนอกโดยตรง
# ให้ผ่าน Nginx ที่มี SSL
```

### 3. Rate Limiting

เพิ่ม rate limiting ใน Express:

```bash
npm install express-rate-limit
```

### 4. CORS Configuration

```javascript
// server.js - Production CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://app.yourdomain.com']
    : '*',
  credentials: true
};
app.use(cors(corsOptions));
```

---

## 📝 Summary

### คำสั่งหลักสำหรับ Production:

```bash
# เริ่มต้น
docker-compose -f docker-compose.prod.yml up --build -d

# Update
docker-compose -f docker-compose.prod.yml up --build -d

# Stop (ข้อมูลไม่หาย)
docker-compose -f docker-compose.prod.yml down

# Backup
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C -Q "BACKUP DATABASE..."
```

### ⚠️ สิ่งที่ต้องเปลี่ยนก่อน Deploy:

1. ✅ เปลี่ยน `MSSQL_SA_PASSWORD`
2. ✅ เปลี่ยน `JWT_SECRET`
3. ✅ สร้างไฟล์ `.env` (ไม่ commit ใน git)
4. ✅ อัปเดต CORS settings
5. ✅ ลบ seed script หรือห้ามรัน
6. ✅ ตั้งค่า backup automation

---

**หากต้องการความช่วยเหลือเพิ่มเติม ติดต่อ IT Department**

