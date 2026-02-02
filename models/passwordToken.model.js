const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const PasswordToken = sequelize.define('PasswordToken', {
  passwordTokenId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'passwordTokenId'
  },
  tokenHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'tokenHash'
  },
  expireAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expireAt'
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'used'
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
  tableName: 'PasswordTokens',
  timestamps: true
});

module.exports = PasswordToken;

