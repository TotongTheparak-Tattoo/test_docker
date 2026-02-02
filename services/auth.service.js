const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async register(userData) {
    const { emp_no, email, full_name, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [User.sequelize.Sequelize.Op.or]: [{ emp_no }, { email }] 
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
      emp_no,
      email,
      full_name,
      password: hashedPassword,
      signup_status: 'activate'
    });

    return user;
  }

  async loginWithPassword(emp_no, password) {
    const user = await User.findOne({ where: { emp_no } });
    if (!user || !user.password) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = this.generateToken(user);
    return { token, user };
  }

  generateToken(user) {
    return jwt.sign(
      { 
        user_id: user.user_id, 
        emp_no: user.emp_no, 
        email: user.email,
        name: user.full_name 
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
