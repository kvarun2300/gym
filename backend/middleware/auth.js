const { verifyToken } = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

/**
 * Verifies JWT access token from Authorization header and attaches req.user
 */
const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized, no token provided');
  }

  let decoded;
  try {
    decoded = verifyToken(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Session expired, please log in again');
    }
    throw ApiError.unauthorized('Not authorized, invalid token');
  }

  const user = await User.findByPk(decoded.id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
  });

  if (!user) {
    throw ApiError.unauthorized('User no longer exists');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Contact admin.');
  }

  req.user = user;
  next();
};

module.exports = { protect };
