const authenticateJWT = require('./authenticateJWT');

const meMiddleware = (req, res, next) => {
  
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.me = req.user.id; 
  next();
};

module.exports = [authenticateJWT, meMiddleware];
