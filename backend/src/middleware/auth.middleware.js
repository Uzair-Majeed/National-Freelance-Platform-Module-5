/**
 * MIDDLEWARE LAYER - AuthMiddleware
 * Dummy middleware to simulate an authenticated user since the User Module is external.
 * In a real scenario, this would verify a JWT and attach decoded user info to req.user.
 */

const authMiddleware = (req, res, next) => {
  // Dummy authenticated user
  req.user = {
    userId: '550e8400-e29b-41d4-a716-446655440000', // Dummy UUID consistent with seed data
    email: 'test@example.com',
  };
  next();
};

module.exports = authMiddleware;
