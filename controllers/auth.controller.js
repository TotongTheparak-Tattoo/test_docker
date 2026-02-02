const AuthService = require('../services/auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { emp_no, email, full_name, password } = req.body;
      const user = await AuthService.register({ emp_no, email, full_name, password });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          emp_no: user.emp_no,
          email: user.email,
          name: user.full_name
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { emp_no, password } = req.body;
      const { token, user } = await AuthService.loginWithPassword(emp_no, password);
      
      res.json({
        success: true,
        token: token,
        user: {
          emp_no: user.emp_no,
          email: user.email,
          name: user.full_name,
          picture: user.profile_picture
        }
      });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('No token provided');
      
      const decoded = await AuthService.verifySessionToken(token);
      res.json({ success: true, user: decoded });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();
