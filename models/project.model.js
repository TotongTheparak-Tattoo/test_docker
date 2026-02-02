const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Project = sequelize.define('Project', {
  projectId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'projectId'
  },
  projectName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'projectName'
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
  tableName: 'Projects',
  timestamps: true
});

module.exports = Project;

