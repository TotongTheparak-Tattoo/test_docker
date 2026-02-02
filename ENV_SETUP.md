# 🔧 Environment Setup Guide

## 📋 วิธี Setup Environment Files

### 🎯 Quick Start (Development)

```bash
# Windows PowerShell
powershell -File setup-env.ps1

# หรือ Linux/Mac
bash setup-env.sh

# เลือก 1 (Development)
# จะ copy .env.development → .env
```

### 🏭 Production Setup

```bash
# Windows PowerShell
powershell -File setup-env.ps1

# เลือก 2 (Production)
# จะ copy .env.example → .env
# แล้วแก้ไข .env ให้ใส่ค่าจริง
```

---

## 📁 ไฟล์ Environment ที่มี

### ✅ `.env.development` (Commit ได้)
- สำหรับ Development Team
- มี default values ที่ใช้ได้เลย
- **Commit ลง git ได้** (เพราะเป็น dev config)

### ⚠️ `.env.example` (Template)
- Template สำหรับ Production
- ไม่มี sensitive data
- Commit ลง git ได้

### 🔒 `.env` (ไม่ Commit!)
- ไฟล์จริงที่ใช้รัน
- ต้องสร้างเองจาก `.env.development` หรือ `.env.example`
- **ห้าม commit ลง git!**

---

## 🚀 วิธีใช้งาน

### Development (ทีมพัฒนา)

```bash
# 1. Clone repository
git clone <repo-url>
cd test_docker

# 2. Setup environment (เลือก 1)
powershell -File setup-env.ps1
# หรือ
copy .env.development .env

# 3. Run
docker-compose up -d
```

**✅ ข้อดี:** 
- ไม่ต้องแก้ไขอะไร ใช้ได้เลย
- ทีมทุกคนใช้ config เดียวกัน
- Commit `.env.development` ได้

### Production (Deploy จริง)

```bash
# 1. Clone repository
git clone <repo-url>
cd test_docker

# 2. Setup environment (เลือก 2)
powershell -File setup-env.ps1
# หรือ
copy .env.example .env

# 3. แก้ไข .env ให้ใส่ค่าจริง
notepad .env
# หรือ
nano .env

# 4. เปลี่ยนค่าต่อไปนี้:
#    - MSSQL_SA_PASSWORD=YourStrongPassword123!
#    - JWT_SECRET=your-complex-random-string-min-32-chars
#    - DB_PASS=YourStrongPassword123!

# 5. Run Production
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔐 Security Best Practices

### ✅ ควรทำ

1. **Development:**
   - ใช้ `.env.development` (commit ได้)
   - ทีมทุกคนใช้ config เดียวกัน

2. **Production:**
   - ใช้ `.env.example` เป็น template
   - สร้าง `.env` เองและใส่ค่าจริง
   - **ห้าม commit `.env` ลง git!**

3. **Git:**
   - Commit `.env.development` ✅
   - Commit `.env.example` ✅
   - **ไม่ commit `.env`** ❌

### ❌ อย่าทำ

- ❌ Commit `.env` ที่มี production passwords
- ❌ Share `.env` ผ่าน email/chat
- ❌ ใช้ development passwords ใน production
- ❌ Hard-code passwords ใน code

---

## 📝 Environment Variables

### Development (.env.development)

```env
DB_HOST=db
DB_USER=sa
DB_PASS=MicAdmin123!          # Dev password (OK to commit)
MSSQL_SA_PASSWORD=MicAdmin123! # Dev password (OK to commit)
JWT_SECRET=minebea-central-secret-key-2026  # Dev secret (OK to commit)
```

### Production (.env)

```env
DB_HOST=db
DB_USER=sa
DB_PASS=YourVeryStrongPassword123!@#  # ⚠️ ต้องเปลี่ยน!
MSSQL_SA_PASSWORD=YourVeryStrongPassword123!@#  # ⚠️ ต้องเปลี่ยน!
JWT_SECRET=your-super-complex-random-string-minimum-32-characters  # ⚠️ ต้องเปลี่ยน!
```

---

## 🔄 Workflow

### Development Workflow

```
1. git clone <repo>
2. copy .env.development .env
3. docker-compose up -d
4. ✅ ใช้ได้เลย!
```

### Production Workflow

```
1. git clone <repo>
2. copy .env.example .env
3. แก้ไข .env (ใส่ passwords จริง)
4. docker-compose -f docker-compose.prod.yml up -d
5. ✅ Deploy สำเร็จ!
```

---

## 🛠️ Manual Setup (ถ้าไม่ใช้ script)

### Windows

```powershell
# Development
Copy-Item .env.development .env

# Production
Copy-Item .env.example .env
notepad .env  # แก้ไขค่าต่าง ๆ
```

### Linux/Mac

```bash
# Development
cp .env.development .env

# Production
cp .env.example .env
nano .env  # แก้ไขค่าต่าง ๆ
```

---

## ❓ FAQ

### Q: ทำไมต้องมี 2 ไฟล์ (.env.development และ .env.example)?

**A:** 
- `.env.development` = สำหรับ dev team (commit ได้, ใช้ได้เลย)
- `.env.example` = template สำหรับ production (ต้องแก้ไข)

### Q: ทำไมไม่ commit `.env` ไปเลย?

**A:** 
- `.env` มี production passwords/secrets
- ถ้า commit จะมีใน git history ถาวร
- แม้ลบออกภายหลังก็ยังหาได้จาก git history
- **ไม่ปลอดภัย!**

### Q: ถ้าต้องการให้ทีมใช้ config เดียวกันล่ะ?

**A:** 
- Development: ใช้ `.env.development` (commit ได้)
- Production: แต่ละ environment สร้าง `.env` เอง
- หรือใช้ secrets management (AWS Secrets Manager, HashiCorp Vault)

### Q: ถ้า `.env` ถูก commit ไปแล้วล่ะ?

**A:**
```bash
# ลบออกจาก git (แต่ยังเก็บไฟล์ไว้)
git rm --cached .env

# Commit การลบ
git commit -m "Remove .env from git"

# เปลี่ยน passwords ทั้งหมดทันที!
# เพราะ passwords ยังอยู่ใน git history
```

---

## 📚 เอกสารเพิ่มเติม

- [README.md](README.md) - คู่มือหลัก
- [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) - Production deployment
- [COMMANDS.md](COMMANDS.md) - คำสั่งที่ใช้บ่อย

---

**สรุป:** 
- ✅ Development: ใช้ `.env.development` (commit ได้)
- ⚠️ Production: ใช้ `.env.example` แล้วแก้ไขเอง (ไม่ commit `.env`)

