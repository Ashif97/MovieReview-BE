const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log('Middleware token:', token);  // Debug: Log the token
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Middleware decoded:', decoded);  // Debug: Log the decoded token
    req.user = decoded.userId;
    next();
  } catch (err) {
    console.error('Middleware error:', err);  // Debug: Log any errors
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
