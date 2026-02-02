const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Division = sequelize.define('Division', {
  divisionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'divisionId'
  },
  divisionName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'divisionName'
  },
  divisionCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'divisionCode'
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
  tableName: 'Divisions',
  timestamps: true
});

module.exports = Division;

