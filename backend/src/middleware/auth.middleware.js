/**
 * MIDDLEWARE LAYER - AuthMiddleware
 * Dummy middleware to simulate an authenticated user since the User Module is external.
 * In a real scenario, this would verify a JWT and attach decoded user info to req.user.
 */

const authMiddleware = (req, res, next) => {
  // Dummy authenticated user
  req.user = {
    userId: '11111111-1111-1111-1111-111111111111', // Dummy UUID
    email: 'test@example.com',
  };
  next();
};

module.exports = authMiddleware;
