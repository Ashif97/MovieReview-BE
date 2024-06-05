const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { auth, adminAuth };
