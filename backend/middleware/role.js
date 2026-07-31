const ApiError = require('../utils/ApiError');

/**
 * Restricts route access to specific roles.
 * Usage: authorize('admin', 'trainer')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Not authorized');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role '${req.user.role}' is not permitted to access this resource`
      );
    }
    next();
  };
};

module.exports = { authorize };
