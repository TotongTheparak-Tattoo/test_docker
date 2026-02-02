# คำสั่งที่ใช้บ่อย - Quick Reference

## 🚀 Development

### เริ่มต้นใช้งาน
```bash
# สร้างและเริ่ม containers
docker-compose up --build -d

# Seed ข้อมูลตัวอย่าง
docker exec minebea-auth-service node seed.js

# ดู logs
docker logs minebea-auth-service -f
```

### จัดการ Containers
```bash
# เริ่ม
docker-compose up -d

# หยุด (ข้อมูลไม่หาย)
docker-compose down

# Restart
docker-compose restart

# Rebuild
docker-compose up --build -d

# ดูสถานะ
docker ps
```

### ดู Logs
```bash
# Auth service
docker logs minebea-auth-service -f
docker logs minebea-auth-service --tail 100

# Database
docker logs minebea_auth_db -f
```

---

## 🏭 Production

### ⚠️ ก่อน Deploy ครั้งแรก
```bash
# 1. สร้าง .env
cp .env.example .env

# 2. แก้ไข .env (สำคัญ!)
nano .env
# หรือ
notepad .env

# 3. เปลี่ยนค่าต่อไปนี้:
#    - MSSQL_SA_PASSWORD
#    - JWT_SECRET
#    - DB_PASS
```

### Deploy Production
```bash
# Build
docker-compose -f docker-compose.prod.yml build

# Start
docker-compose -f docker-compose.prod.yml up -d

# ตรวจสอบสถานะ
docker-compose -f docker-compose.prod.yml ps

# ดู logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Update Production
```bash
# Pull code ใหม่
git pull

# Rebuild และ restart
docker-compose -f docker-compose.prod.yml up --build -d

# หรือ restart เฉพาะ service
docker-compose -f docker-compose.prod.yml restart auth-service
```

### Stop Production
```bash
# หยุด (ข้อมูลไม่หาย)
docker-compose -f docker-compose.prod.yml down

# หยุดและลบ volumes (ระวัง! ข้อมูลหาย)
docker-compose -f docker-compose.prod.yml down -v
```

---

## 💾 Database Management

### เข้าถึง Database (Development)
```bash
# เข้า SQL Server
docker exec -it minebea_auth_db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "MicAdmin123!" -C

# Run SQL query
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "MicAdmin123!" -C \
  -d minebea_central_auth \
  -Q "SELECT * FROM Users"
```

### เข้าถึง Database (Production)
```bash
# ใช้ password จาก .env
docker exec minebea_auth_db_prod /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C

# Run SQL query
docker exec minebea_auth_db_prod /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C \
  -d minebea_central_auth \
  -Q "SELECT COUNT(*) as UserCount FROM Users"
```

### Backup Database
```bash
# Development
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "MicAdmin123!" -C \
  -Q "BACKUP DATABASE minebea_central_auth TO DISK = '/var/opt/mssql/backup/dev_backup.bak'"

# Production
docker exec minebea_auth_db_prod /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C \
  -Q "BACKUP DATABASE minebea_central_auth TO DISK = '/var/opt/mssql/backup/prod_backup_$(date +%Y%m%d_%H%M%S).bak'"

# Copy backup ออกมา
docker cp minebea_auth_db_prod:/var/opt/mssql/backup/ ./backups/
```

### Restore Database
```bash
# Copy backup เข้าไป
docker cp ./backups/backup.bak minebea_auth_db_prod:/var/opt/mssql/backup/

# Restore
docker exec minebea_auth_db_prod /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C \
  -Q "RESTORE DATABASE minebea_central_auth FROM DISK = '/var/opt/mssql/backup/backup.bak' WITH REPLACE"
```

### ดูตารางทั้งหมด
```bash
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "MicAdmin123!" -C \
  -d minebea_central_auth \
  -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
```

### ลบตารางทั้งหมด (ระวัง!)
```bash
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "MicAdmin123!" -C \
  -d minebea_central_auth \
  -Q "DROP TABLE IF EXISTS UserPermissionDetails, Permissions, PasswordTokens, Users, Projects, Roles, Divisions"

# Restart service เพื่อสร้างตารางใหม่
docker restart minebea-auth-service
```

---

## 🧪 Testing

### ทดสอบ API
```bash
# ใช้ PowerShell script
powershell -File test_api.ps1

# หรือใช้ curl
curl http://localhost:6200/api/auth/verify-token
```

### Seed ข้อมูลใหม่
```bash
# Development
docker exec minebea-auth-service node seed.js

# Production (ไม่แนะนำ)
docker exec minebea-auth-service-prod node seed.js
```

---

## 🔍 Monitoring

### ดูสถานะ Containers
```bash
# ดู containers ทั้งหมด
docker ps

# ดู containers ที่หยุดแล้ว
docker ps -a

# ดูการใช้ resources
docker stats
```

### ดู Volumes
```bash
# ดู volumes
docker volume ls

# ดูรายละเอียด volume
docker volume inspect test_docker_db_data

# ดูขนาดที่ใช้
docker system df -v
```

### Health Check
```bash
# ตรวจสอบ health status
docker inspect minebea-auth-service | grep -A 10 Health

# หรือใน Windows PowerShell
docker inspect minebea-auth-service | Select-String -Pattern "Health" -Context 0,10
```

---

## 🧹 Cleanup

### ลบ Containers
```bash
# ลบ containers ที่หยุดแล้ว
docker container prune

# ลบ containers ทั้งหมด (ระวัง!)
docker-compose down
```

### ลบ Images
```bash
# ลบ images ที่ไม่ใช้
docker image prune

# ลบ images ทั้งหมด (ระวัง!)
docker rmi $(docker images -q)
```

### ลบ Volumes
```bash
# ลบ volumes ที่ไม่ได้ใช้
docker volume prune

# ลบ volume เฉพาะ (ระวัง! ข้อมูลหาย)
docker volume rm test_docker_db_data
```

### ทำความสะอาดทั้งหมด
```bash
# ลบทุกอย่างที่ไม่ใช้งาน (ระวัง!)
docker system prune -a --volumes
```

---

## 🔧 Troubleshooting

### Container ไม่ start
```bash
# ดู logs
docker logs minebea-auth-service

# ดู error จาก docker compose
docker-compose logs
```

### Database connection failed
```bash
# ตรวจสอบว่า DB container healthy
docker ps

# Restart auth service
docker restart minebea-auth-service
```

### Port already in use
```bash
# Windows: หา process ที่ใช้ port
netstat -ano | findstr :6200
netstat -ano | findstr :1433

# Kill process (ใช้ PID จากคำสั่งข้างบน)
taskkill /PID <PID> /F
```

### ต้องการเริ่มใหม่หมด
```bash
# Development
docker-compose down -v
docker-compose up --build -d
docker exec minebea-auth-service node seed.js

# Production
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up --build -d
```

---

## 📦 Build & Push (CI/CD)

### Build Image
```bash
# Development
docker build -t minebea-auth-service:dev .

# Production
docker build -f Dockerfile.prod -t minebea-auth-service:prod .
```

### Tag & Push (if using registry)
```bash
# Tag
docker tag minebea-auth-service:prod your-registry/minebea-auth-service:1.0.0

# Push
docker push your-registry/minebea-auth-service:1.0.0

# Pull
docker pull your-registry/minebea-auth-service:1.0.0
```

---

## 📝 Quick Copy-Paste Commands

### Development - ใช้บ่อย
```bash
docker-compose up -d                           # เริ่ม
docker-compose down                            # หยุด
docker logs minebea-auth-service -f            # ดู logs
docker exec minebea-auth-service node seed.js  # Seed data
```

### Production - ใช้บ่อย
```bash
docker-compose -f docker-compose.prod.yml up -d                    # เริ่ม
docker-compose -f docker-compose.prod.yml down                     # หยุด
docker-compose -f docker-compose.prod.yml logs -f                  # ดู logs
docker-compose -f docker-compose.prod.yml restart auth-service     # Restart
```

### Backup - ใช้บ่อย
```bash
# Backup
docker exec minebea_auth_db_prod /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C -Q "BACKUP DATABASE minebea_central_auth TO DISK = '/var/opt/mssql/backup/backup_$(date +%Y%m%d_%H%M%S).bak'"

# Copy ออกมา
docker cp minebea_auth_db_prod:/var/opt/mssql/backup/ ./backups/
```

