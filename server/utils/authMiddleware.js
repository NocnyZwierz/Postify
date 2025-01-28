const Session = require('../models/Session.model');

const authMiddleware = async (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = authMiddleware;
