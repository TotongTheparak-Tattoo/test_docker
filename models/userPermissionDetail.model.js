const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const UserPermissionDetail = sequelize.define('UserPermissionDetail', {
  userPermissionDetailId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'userPermissionDetailId'
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'status'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'lastLoginAt'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'userId',
    references: {
      model: 'Users',
      key: 'userId'
    }
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'permissionId',
    references: {
      model: 'Permissions',
      key: 'permissionId'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'createdAt'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updatedAt'
  }
}, {
  tableName: 'UserPermissionDetails',
  timestamps: true
});

module.exports = UserPermissionDetail;

