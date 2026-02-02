# Database Schema - Minebea Auth Service

## ER Diagram Summary

โครงสร้างฐานข้อมูลประกอบด้วย 7 ตาราง พร้อม relationships ตามที่กำหนด

## Tables

### 1. Divisions
จัดเก็บข้อมูลแผนก/ฝ่ายต่าง ๆ

| Column | Type | Description |
|--------|------|-------------|
| divisionId | INT (PK) | รหัสแผนก (Auto increment) |
| divisionName | VARCHAR(100) | ชื่อแผนก |
| divisionCode | VARCHAR(100) | รหัสแผนก |
| createdAt | DATETIMEOFFSET | วันที่สร้าง |
| updatedAt | DATETIMEOFFSET | วันที่อัปเดต |

**Relationships:**
- `1` Division → `N` Users

---

### 2. Roles
จัดเก็บบทบาท/ตำแหน่งต่าง ๆ

| Column | Type | Description |
|--------|------|-------------|
| roleId | INT (PK) | รหัสบทบาท (Auto increment) |
| roleName | VARCHAR(100) | ชื่อบทบาท |
| createdAt | DATETIMEOFFSET | วันที่สร้าง |
| updatedAt | DATETIMEOFFSET | วันที่อัปเดต |

**Relationships:**
- `1` Role → `N` Permissions

---

### 3. Projects
จัดเก็บข้อมูลโครงการต่าง ๆ

| Column | Type | Description |
|--------|------|-------------|
| projectId | INT (PK) | รหัสโครงการ (Auto increment) |
| projectName | VARCHAR(100) | ชื่อโครงการ |
| createdAt | DATETIMEOFFSET | วันที่สร้าง |
| updatedAt | DATETIMEOFFSET | วันที่อัปเดต |

**Relationships:**
- `1` Project → `N` Permissions

---

### 4. Users
จัดเก็บข้อมูลผู้ใช้งาน

| Column | Type | Description |
|--------|------|-------------|
| userId | INT (PK) | รหัสผู้ใช้ (Auto increment) |
| fullName | VARCHAR(100) | ชื่อ-นามสกุล |
| empNo | VARCHAR(20) | รหัสพนักงาน |
| password | VARCHAR(255) | รหัสผ่าน (hashed) |
| email | VARCHAR(100) | อีเมล |
| status | BOOLEAN | สถานะใช้งาน |
| divisionId | INT (FK) | รหัสแผนก (FK → Divisions) |
| createdAt | DATETIMEOFFSET | วันที่สร้าง |
| updatedAt | DATETIMEOFFSET | วันที่อัปเดต |

**Relationships:**
- `N` Users → `1` Division
- `1` User → `N` PasswordTokens
- `1` User → `N` UserPermissionDetails

---

### 5. PasswordTokens
จัดเก็บ tokens สำหรับ reset password

| Column | Type | Description |
|--------|------|-------------|
| passwordTokenId | INT (PK) | รหัส token (Auto increment) |
| tokenHash | VARCHAR(255) | Token hash |
| expireAt | DATETIMEOFFSET | วันหมดอายุ |
| used | BOOLEAN | สถานะการใช้งาน |
| userId | INT (FK) | รหัสผู้ใช้ (FK → Users) |
| createdAt | DATETIMEOFFSET | วันที่สร้าง |
| updatedAt | DATETIMEOFFSET | วันที่อัปเดต |

**Relationships:**
- `N` PasswordTokens → `1` User

---

### 6. Permissions
จัดเก็บสิทธิ์การเข้าถึงโครงการตามบทบาท

| Column | Type | Description |
|--------|------|-------------|
| permissionId | INT (PK) | รหัสสิทธิ์ (Auto increment) |
| projectId | INT (FK) | รหัสโครงการ (FK → Projects) |
| roleId | INT (FK) | รหัสบทบาท (FK → Roles) |
| createdAt | DATETIMEOFFSET | วันที่สร้าง |
| updatedAt | DATETIMEOFFSET | วันที่อัปเดต |

**Relationships:**
- `N` Permissions → `1` Project
- `N` Permissions → `1` Role
- `1` Permission → `N` UserPermissionDetails

**Business Logic:**
Permission กำหนดว่า Role ไหนสามารถเข้าถึง Project ไหนได้

---

### 7. UserPermissionDetails
จัดเก็บสิทธิ์ที่ผู้ใช้แต่ละคนได้รับ

| Column | Type | Description |
|--------|------|-------------|
| userPermissionDetailId | INT (PK) | รหัสรายละเอียดสิทธิ์ (Auto increment) |
| status | BOOLEAN | สถานะเปิดใช้งาน |
| lastLoginAt | DATETIMEOFFSET | เวลา login ล่าสุด |
| userId | INT (FK) | รหัสผู้ใช้ (FK → Users) |
| permissionId | INT (FK) | รหัสสิทธิ์ (FK → Permissions) |
| createdAt | DATETIMEOFFSET | วันที่สร้าง |
| updatedAt | DATETIMEOFFSET | วันที่อัปเดต |

**Relationships:**
- `N` UserPermissionDetails → `1` User
- `N` UserPermissionDetails → `1` Permission

**Business Logic:**
เชื่อมโยง User กับ Permission เพื่อกำหนดว่าผู้ใช้คนไหนมีสิทธิ์อะไรบ้าง

---

## Relationships Diagram

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

## Example Usage Flow

### การกำหนดสิทธิ์ให้ผู้ใช้:

1. **สร้าง Division** (เช่น IT Department)
2. **สร้าง Role** (เช่น Admin, Viewer)
3. **สร้าง Project** (เช่น WMS System, HR System)
4. **สร้าง Permission** (เชื่อม Project + Role) 
   - เช่น: WMS System + Admin = สิทธิ์ Admin ใน WMS
5. **สร้าง User** (ระบุ Division)
6. **สร้าง UserPermissionDetail** (เชื่อม User + Permission)
   - เช่น: User A ได้รับสิทธิ์ Admin ใน WMS System

### ตัวอย่าง:

```javascript
// Division
{ divisionId: 1, divisionName: "IT Department" }

// Role
{ roleId: 1, roleName: "Admin" }
{ roleId: 2, roleName: "Viewer" }

// Project
{ projectId: 1, projectName: "WMS System" }

// Permission (Project + Role)
{ permissionId: 1, projectId: 1, roleId: 1 } // WMS + Admin

// User
{ userId: 1, fullName: "John Doe", divisionId: 1 }

// UserPermissionDetail (User + Permission)
{ 
  userPermissionDetailId: 1, 
  userId: 1, 
  permissionId: 1,  // John มีสิทธิ์ Admin ใน WMS
  status: true 
}
```

## Sequelize Models

Models ทั้งหมดอยู่ใน folder `models/`:

- `division.model.js`
- `role.model.js`
- `project.model.js`
- `user.model.js`
- `passwordToken.model.js`
- `permission.model.js`
- `userPermissionDetail.model.js`
- `index.js` (Export และกำหนด relationships)

## การใช้งาน Models

```javascript
// Import models
const { 
  Division, 
  Role, 
  Project, 
  User, 
  Permission, 
  UserPermissionDetail 
} = require('./models');

// Query with relationships
const user = await User.findOne({
  where: { userId: 1 },
  include: [
    { model: Division, as: 'division' },
    {
      model: UserPermissionDetail,
      as: 'userPermissionDetails',
      include: [
        {
          model: Permission,
          as: 'permission',
          include: [
            { model: Project, as: 'project' },
            { model: Role, as: 'role' }
          ]
        }
      ]
    }
  ]
});
```

## Database Status

✅ ทุกตารางถูกสร้างเรียบร้อยแล้ว
✅ Foreign Keys ถูกกำหนดอย่างถูกต้อง
✅ Relationships ทำงานได้ตามที่ออกแบบ
✅ ข้อมูลจะไม่หายเมื่อ `docker-compose down`

