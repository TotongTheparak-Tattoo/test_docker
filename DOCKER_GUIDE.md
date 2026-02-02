# คู่มือการใช้งาน Docker - Minebea Auth Service

## 🐳 โครงสร้าง Docker

Project นี้ประกอบด้ไปด้วย 2 containers:

1. **minebea_auth_db** - SQL Server 2022 Express Edition
2. **minebea-auth-service** - Node.js Authentication Service

## 📦 การจัดเก็บข้อมูล (Data Persistence)

### ✅ ข้อมูลไม่หายเมื่อ restart หรือ stop containers

ข้อมูลใน database ถูกเก็บไว้ใน **Docker Volume** ชื่อ `test_docker_db_data` 

```yaml
volumes:
  - db_data:/var/opt/mssql  # เก็บข้อมูล SQL Server
```

### คำสั่งที่ **ปลอดภัย** (ข้อมูลไม่หาย)

```bash
# หยุด containers (ข้อมูลไม่หาย)
docker-compose stop

# หยุดและลบ containers (ข้อมูลไม่หาย)
docker-compose down

# Restart containers
docker-compose restart

# Restart เฉพาะ service
docker restart minebea-auth-service
docker restart minebea_auth_db
```

### คำสั่งที่ **ลบข้อมูล** (ระวัง!)

```bash
# ลบทั้ง containers และ volumes (ข้อมูลหายทั้งหมด!)
docker-compose down -v

# ลบ volume เฉพาะ
docker volume rm test_docker_db_data
```

## 🚀 คำสั่งพื้นฐาน

### เริ่มต้นใช้งาน

```bash
# สร้างและเริ่ม containers (ครั้งแรก)
docker-compose up --build -d

# หรือเริ่ม containers ปกติ
docker-compose up -d
```

### ตรวจสอบสถานะ

```bash
# ดู containers ที่กำลังทำงาน
docker ps

# ดู logs
docker logs minebea-auth-service
docker logs minebea_auth_db

# ดู logs แบบ real-time
docker logs -f minebea-auth-service

# ดู volumes ทั้งหมด
docker volume ls

# ดูข้อมูล volume เฉพาะ
docker volume inspect test_docker_db_data
```

### หยุดและเริ่มใหม่

```bash
# หยุด containers
docker-compose stop

# เริ่ม containers ที่หยุดไว้
docker-compose start

# หยุดและลบ containers (ข้อมูลยังอยู่)
docker-compose down

# เริ่มใหม่ทั้งหมด
docker-compose up -d
```

### เข้าถึง Database

```bash
# เชื่อมต่อ SQL Server
docker exec -it minebea_auth_db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MicAdmin123!" -C

# Run SQL query โดยตรง
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MicAdmin123!" -C -Q "SELECT name FROM sys.databases"

# เข้าไปใน container
docker exec -it minebea_auth_db bash
```

## 🔧 การ Backup และ Restore

### Backup Database

```bash
# Backup database to file
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MicAdmin123!" -C -Q "BACKUP DATABASE minebea_central_auth TO DISK = '/var/opt/mssql/backup/auth_backup.bak'"

# Copy backup file ออกมา
docker cp minebea_auth_db:/var/opt/mssql/backup/auth_backup.bak ./backup/
```

### Restore Database

```bash
# Copy backup file เข้าไป
docker cp ./backup/auth_backup.bak minebea_auth_db:/var/opt/mssql/backup/

# Restore database
docker exec minebea_auth_db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MicAdmin123!" -C -Q "RESTORE DATABASE minebea_central_auth FROM DISK = '/var/opt/mssql/backup/auth_backup.bak' WITH REPLACE"
```

### Backup Volume ทั้งหมด

```bash
# Backup volume เป็น tar file
docker run --rm -v test_docker_db_data:/data -v ${PWD}:/backup alpine tar czf /backup/db_data_backup.tar.gz -C /data .

# Restore volume จาก tar file
docker run --rm -v test_docker_db_data:/data -v ${PWD}:/backup alpine tar xzf /backup/db_data_backup.tar.gz -C /data
```

## 🌐 API Endpoints

Base URL: `http://localhost:6200`

- `POST /api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/verify-token` - ตรวจสอบ JWT token

### ทดสอบ API

```bash
# Test verify-token endpoint
curl http://localhost:6200/api/auth/verify-token
```

## 📊 การจัดการ Volume

### ดูข้อมูล Volume

```bash
# ดู volumes ทั้งหมด
docker volume ls

# ดูรายละเอียด volume
docker volume inspect test_docker_db_data

# ดูขนาดที่ใช้
docker system df -v
```

### ทำความสะอาด (ระวัง!)

```bash
# ลบ containers, networks และ volumes ที่ไม่ใช้งาน
docker system prune

# ลบ volumes ที่ไม่ได้ใช้งาน (ระวัง!)
docker volume prune
```

## ⚠️ สิ่งที่ควรรู้

1. **ข้อมูลปลอดภัย**: ใช้ `docker-compose down` ได้เลย ข้อมูลไม่หาย
2. **อย่าใช้ -v flag**: อย่าใช้ `docker-compose down -v` ถ้าไม่ต้องการลบข้อมูล
3. **Volume Location**: ข้อมูลถูกเก็บใน Docker volume ไม่ได้อยู่ใน project folder
4. **Backup สม่ำเสมอ**: แนะนำให้ backup database เป็นประจำ

## 🔒 Security Notes

⚠️ **สำคัญ**: Password ใน docker-compose.yml เป็นแบบ hard-coded  
สำหรับ production ควร:
- ใช้ Docker secrets หรือ environment variables จากไฟล์ภายนอก
- เปลี่ยน SA password เป็นแบบที่ปลอดภัยกว่า
- ใช้ SSL/TLS สำหรับ database connection

## 📝 Log Management

```bash
# ดู logs แบบระบุจำนวนบรรทัด
docker logs --tail 100 minebea-auth-service

# ดู logs ตั้งแต่เวลาที่กำหนด
docker logs --since 30m minebea-auth-service

# ดู logs พร้อม timestamp
docker logs -t minebea-auth-service
```

## 🆘 Troubleshooting

### Container ไม่ start

```bash
# ดู logs เพื่อหาสาเหตุ
docker logs minebea_auth_db
docker logs minebea-auth-service

# ลอง rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database connection failed

```bash
# ตรวจสอบว่า DB container healthy
docker ps

# ตรวจสอบ network
docker network inspect test_docker_auth_network

# Restart auth service
docker restart minebea-auth-service
```

### ต้องการเริ่มใหม่หมด (ลบข้อมูลทั้งหมด)

```bash
docker-compose down -v
docker volume rm test_docker_db_data
docker-compose up --build -d
```

