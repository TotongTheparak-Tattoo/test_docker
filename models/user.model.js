const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  emp_no: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING(255)
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: true // Nullable for Google-only users
  },
  google_id: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  signup_status: {
    type: DataTypes.STRING(20),
    defaultValue: 'activate'
  }
}, {
  tableName: 'Users',
  timestamps: true
});

module.exports = User;
