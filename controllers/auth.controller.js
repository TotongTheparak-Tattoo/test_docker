const AuthService = require('../services/auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { empNo, email, fullName, password } = req.body;
      const user = await AuthService.register({ empNo, email, fullName, password });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          empNo: user.empNo,
          email: user.email,
          fullName: user.fullName
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { empNo, password } = req.body;
      const { token, user } = await AuthService.loginWithPassword(empNo, password);
      
      res.json({
        success: true,
        token: token,
        user: {
          empNo: user.empNo,
          email: user.email,
          fullName: user.fullName,
          status: user.status
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
