const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

class AuthService {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async register(userData) {
    const { empNo, email, fullName, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ empNo }, { email }] 
      } 
    });

    if (existingUser) {
      throw new Error('User with this Employee No or Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      empNo,
      email,
      fullName,
      password: hashedPassword,
      status: true
    });

    return user;
  }

  async loginWithPassword(empNo, password) {
    const user = await User.findOne({ where: { empNo } });
    if (!user || !user.password) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = this.generateToken(user);
    return { token, user };
  }

  generateToken(user) {
    return jwt.sign(
      { 
        userId: user.userId, 
        empNo: user.empNo, 
        email: user.email,
        fullName: user.fullName 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  async verifySessionToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new AuthService();
