const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Permission = sequelize.define('Permission', {
  permissionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'permissionId'
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'projectId',
    references: {
      model: 'Projects',
      key: 'projectId'
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'roleId',
    references: {
      model: 'Roles',
      key: 'roleId'
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
  tableName: 'Permissions',
  timestamps: true
});

module.exports = Permission;

