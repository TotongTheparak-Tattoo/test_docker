const sequelize = require('../config/db.config');

// Import all models
const Division = require('./division.model');
const Role = require('./role.model');
const Project = require('./project.model');
const User = require('./user.model');
const PasswordToken = require('./passwordToken.model');
const Permission = require('./permission.model');
const UserPermissionDetail = require('./userPermissionDetail.model');

// Define relationships

// Division ||--o{ User (One Division has many Users)
Division.hasMany(User, {
  foreignKey: 'divisionId',
  as: 'users'
});
User.belongsTo(Division, {
  foreignKey: 'divisionId',
  as: 'division'
});

// User ||--o{ PasswordToken (One User has many PasswordTokens)
User.hasMany(PasswordToken, {
  foreignKey: 'userId',
  as: 'passwordTokens'
});
PasswordToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Role ||--o{ Permission (One Role has many Permissions)
Role.hasMany(Permission, {
  foreignKey: 'roleId',
  as: 'permissions'
});
Permission.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role'
});

// Project ||--o{ Permission (One Project has many Permissions)
Project.hasMany(Permission, {
  foreignKey: 'projectId',
  as: 'permissions'
});
Permission.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

// User ||--o{ UserPermissionDetail (One User has many UserPermissionDetails)
User.hasMany(UserPermissionDetail, {
  foreignKey: 'userId',
  as: 'userPermissionDetails'
});
UserPermissionDetail.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Permission ||--o{ UserPermissionDetail (One Permission has many UserPermissionDetails)
Permission.hasMany(UserPermissionDetail, {
  foreignKey: 'permissionId',
  as: 'userPermissionDetails'
});
UserPermissionDetail.belongsTo(Permission, {
  foreignKey: 'permissionId',
  as: 'permission'
});

// Export all models and sequelize instance
module.exports = {
  sequelize,
  Division,
  Role,
  Project,
  User,
  PasswordToken,
  Permission,
  UserPermissionDetail
};

