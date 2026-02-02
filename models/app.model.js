const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const AppRegistration = sequelize.define('AppRegistration', {
  app_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  app_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  client_id: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  redirect_uri: {
    type: DataTypes.STRING(500),
    allowNull: false
  }
}, {
  tableName: 'AppRegistrations'
});

module.exports = AppRegistration;
