# Minebea Central Auth Service

Authentication service สำหรับระบบ Minebea พร้อม Permission Management

## 📋 Features

- ✅ User Authentication (Login/Register)
- ✅ JWT Token Management
- ✅ Role-Based Access Control (RBAC)
- ✅ Permission Management
- ✅ Project & Division Management
- ✅ SQL Server Database with Sequelize ORM
- ✅ Docker & Docker Compose Support
- ✅ Data Persistence with Docker Volumes

## 🏗️ Architecture

### Database Schema (7 Tables)

```
Division (1) ──────< (N) User
                           │
                           ├────< (N) PasswordToken
                           │
                           └────< (N) UserPermissionDetail
                                          │
                                          └────> (1) Permission
                                                      │
                                                      ├────> (1) Project
                                                      │
                                                      └────> (1) Role
```

## 🚀 Quick Start

### Development

```bash
# 1. Clone repository
git clone <repository-url>
cd test_docker

# 2. Start Docker containers
docker-compose up --build -d

# 3. Seed sample data
docker exec minebea-auth-service node seed.js

# 4. Test API
powershell -File test_api.ps1
```

API จะรันที่: `http://localhost:6200`

### Production

```bash
# 1. สร้างไฟล์ .env จาก template
cp .env.example .env

# 2. แก้ไข .env ให้ใส่ค่าจริง (สำคัญ!)
# - เปลี่ยน MSSQL_SA_PASSWORD
# - เปลี่ยน JWT_SECRET
# - เปลี่ยน DB_PASS

# 3. Build และ Start
docker-compose -f docker-compose.prod.yml up --build -d

# 4. ตรวจสอบสถานะ
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/verify-token` - ตรวจสอบ JWT token

### Example Requests

**Register:**
```json
POST http://localhost:6200/api/auth/register
Content-Type: application/json

{
  "empNo": "EMP001",
  "email": "user@minebea.co.th",
  "fullName": "John Doe",
  "password": "password123"
}
```

**Login:**
```json
POST http://localhost:6200/api/auth/login
Content-Type: application/json

{
  "empNo": "EMP001",
  "password": "password123"
}
```

**Verify Token:**
```
GET http://localhost:6200/api/auth/verify-token
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Models

1. **Division** - แผนก/ฝ่าย
2. **Role** - บทบาท (Admin, Manager, Viewer, Editor)
3. **Project** - โครงการ
4. **User** - ผู้ใช้งาน
5. **PasswordToken** - Token สำหรับ reset password
6. **Permission** - สิทธิ์ (Project + Role)
7. **UserPermissionDetail** - การกำหนดสิทธิ์ให้ User

## 📊 Sample Data (Development)

หลังจาก seed จะมีข้อมูลตัวอย่าง:

**Test Credentials:**
- Username: `EMP001`, Password: `password123` (John - IT Admin)
- Username: `EMP002`, Password: `password123` (Jane - HR Admin)
- Username: `EMP003`, Password: `password123` (Bob - Finance Admin)
- Username: `EMP004`, Password: `password123` (Alice - Production Manager)

## 🐳 Docker Commands

### Development

```bash
# Start
docker-compose up -d

# Stop (ข้อมูลไม่หาย)
docker-compose down

# Rebuild
docker-compose up --build -d

# View logs
docker logs minebea-auth-service -f

# Run seed
docker exec minebea-auth-service node seed.js
```

### Production

```bash
# Start
docker-compose -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.prod.yml down

# Logs
docker-compose -f docker-compose.prod.yml logs -f

# Backup Database
docker exec minebea_auth_db_prod /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C \
  -Q "BACKUP DATABASE minebea_central_auth TO DISK = '/var/opt/mssql/backup/backup.bak'"
```

## 📁 Project Structure

```
test_docker/
├── config/
│   └── db.config.js          # Database configuration
├── controllers/
│   └── auth.controller.js    # Authentication controller
├── models/
│   ├── division.model.js
│   ├── role.model.js
│   ├── project.model.js
│   ├── user.model.js
│   ├── passwordToken.model.js
│   ├── permission.model.js
│   ├── userPermissionDetail.model.js
│   └── index.js              # Models & Relationships
├── routes/
│   └── auth.routes.js        # API routes
├── services/
│   └── auth.service.js       # Business logic
├── docker-compose.yml        # Development
├── docker-compose.prod.yml   # Production
├── Dockerfile                # Development
├── Dockerfile.prod           # Production
├── server.js                 # Entry point
├── seed.js                   # Seed sample data
└── .env.example              # Environment template
```

## 📚 Documentation

- [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - คู่มือการใช้งาน Docker
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - รายละเอียด Database Schema
- [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) - คู่มือ Deploy Production

## ⚙️ Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```env
# Database
DB_HOST=db
DB_USER=sa
DB_PASS=your-password
DB_NAME=minebea_central_auth
DB_DIALECT=mssql

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Server
PORT=6200
NODE_ENV=production

# SQL Server
MSSQL_SA_PASSWORD=your-sql-password
```

## 🔒 Security Checklist for Production

- [ ] เปลี่ยน `MSSQL_SA_PASSWORD`
- [ ] เปลี่ยน `JWT_SECRET` (minimum 32 characters)
- [ ] สร้าง `.env` file (ไม่ commit ใน git)
- [ ] อัปเดต CORS settings
- [ ] เปิด SSL/TLS
- [ ] ตั้งค่า firewall
- [ ] ลบ/ปิด seed script
- [ ] ตั้งค่า rate limiting
- [ ] ตั้งค่า backup automation

## 🛠️ Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: SQL Server 2022
- **ORM**: Sequelize
- **Authentication**: JWT, bcrypt
- **Containerization**: Docker & Docker Compose

## 📝 License

Internal use only - Minebea Corporation

## 👥 Support

ติดต่อ IT Department สำหรับความช่วยเหลือ
