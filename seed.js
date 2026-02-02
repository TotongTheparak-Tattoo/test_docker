require('dotenv').config();
const bcrypt = require('bcrypt');
const {
  sequelize,
  Division,
  Role,
  Project,
  User,
  Permission,
  UserPermissionDetail
} = require('./models');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Create Divisions
    console.log('Creating Divisions...');
    const divisions = await Division.bulkCreate([
      { divisionName: 'IT Department', divisionCode: 'IT' },
      { divisionName: 'HR Department', divisionCode: 'HR' },
      { divisionName: 'Finance Department', divisionCode: 'FIN' },
      { divisionName: 'Production Department', divisionCode: 'PROD' }
    ]);
    console.log(`✅ Created ${divisions.length} divisions`);

    // 2. Create Roles
    console.log('Creating Roles...');
    const roles = await Role.bulkCreate([
      { roleName: 'Admin' },
      { roleName: 'Manager' },
      { roleName: 'Viewer' },
      { roleName: 'Editor' }
    ]);
    console.log(`✅ Created ${roles.length} roles`);

    // 3. Create Projects
    console.log('Creating Projects...');
    const projects = await Project.bulkCreate([
      { projectName: 'WMS System' },
      { projectName: 'HR Management' },
      { projectName: 'Finance System' },
      { projectName: 'Production Planning' }
    ]);
    console.log(`✅ Created ${projects.length} projects`);

    // 4. Create Users
    console.log('Creating Users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.bulkCreate([
      {
        fullName: 'John Doe',
        empNo: 'EMP001',
        password: hashedPassword,
        email: 'john.doe@minebea.co.th',
        status: true,
        divisionId: divisions[0].divisionId // IT Department
      },
      {
        fullName: 'Jane Smith',
        empNo: 'EMP002',
        password: hashedPassword,
        email: 'jane.smith@minebea.co.th',
        status: true,
        divisionId: divisions[1].divisionId // HR Department
      },
      {
        fullName: 'Bob Johnson',
        empNo: 'EMP003',
        password: hashedPassword,
        email: 'bob.johnson@minebea.co.th',
        status: true,
        divisionId: divisions[2].divisionId // Finance Department
      },
      {
        fullName: 'Alice Williams',
        empNo: 'EMP004',
        password: hashedPassword,
        email: 'alice.williams@minebea.co.th',
        status: true,
        divisionId: divisions[3].divisionId // Production Department
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // 5. Create Permissions (Project + Role combinations)
    console.log('Creating Permissions...');
    const permissions = await Permission.bulkCreate([
      // WMS System permissions
      { projectId: projects[0].projectId, roleId: roles[0].roleId }, // WMS + Admin
      { projectId: projects[0].projectId, roleId: roles[1].roleId }, // WMS + Manager
      { projectId: projects[0].projectId, roleId: roles[2].roleId }, // WMS + Viewer
      
      // HR Management permissions
      { projectId: projects[1].projectId, roleId: roles[0].roleId }, // HR + Admin
      { projectId: projects[1].projectId, roleId: roles[2].roleId }, // HR + Viewer
      
      // Finance System permissions
      { projectId: projects[2].projectId, roleId: roles[0].roleId }, // Finance + Admin
      { projectId: projects[2].projectId, roleId: roles[3].roleId }, // Finance + Editor
      
      // Production Planning permissions
      { projectId: projects[3].projectId, roleId: roles[1].roleId }, // Production + Manager
      { projectId: projects[3].projectId, roleId: roles[2].roleId }  // Production + Viewer
    ]);
    console.log(`✅ Created ${permissions.length} permissions`);

    // 6. Assign Permissions to Users
    console.log('Assigning Permissions to Users...');
    const userPermissions = await UserPermissionDetail.bulkCreate([
      // John (IT) - WMS Admin
      {
        userId: users[0].userId,
        permissionId: permissions[0].permissionId, // WMS + Admin
        status: true,
        lastLoginAt: new Date()
      },
      // John (IT) - HR Admin
      {
        userId: users[0].userId,
        permissionId: permissions[3].permissionId, // HR + Admin
        status: true
      },
      
      // Jane (HR) - HR Admin
      {
        userId: users[1].userId,
        permissionId: permissions[3].permissionId, // HR + Admin
        status: true,
        lastLoginAt: new Date()
      },
      // Jane (HR) - WMS Viewer
      {
        userId: users[1].userId,
        permissionId: permissions[2].permissionId, // WMS + Viewer
        status: true
      },
      
      // Bob (Finance) - Finance Admin
      {
        userId: users[2].userId,
        permissionId: permissions[5].permissionId, // Finance + Admin
        status: true,
        lastLoginAt: new Date()
      },
      
      // Alice (Production) - Production Manager
      {
        userId: users[3].userId,
        permissionId: permissions[7].permissionId, // Production + Manager
        status: true,
        lastLoginAt: new Date()
      },
      // Alice (Production) - WMS Viewer
      {
        userId: users[3].userId,
        permissionId: permissions[2].permissionId, // WMS + Viewer
        status: true
      }
    ]);
    console.log(`✅ Created ${userPermissions.length} user permission assignments`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Divisions: ${divisions.length}`);
    console.log(`   - Roles: ${roles.length}`);
    console.log(`   - Projects: ${projects.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Permissions: ${permissions.length}`);
    console.log(`   - User Permission Details: ${userPermissions.length}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('   Username: EMP001, Password: password123 (John - IT Admin)');
    console.log('   Username: EMP002, Password: password123 (Jane - HR Admin)');
    console.log('   Username: EMP003, Password: password123 (Bob - Finance Admin)');
    console.log('   Username: EMP004, Password: password123 (Alice - Production Manager)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run seed
seed();

