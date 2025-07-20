// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = { authenticateJWT };
