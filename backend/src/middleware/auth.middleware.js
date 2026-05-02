/**
 * MIDDLEWARE LAYER - AuthMiddleware
 * Dummy middleware to simulate an authenticated user since the User Module is external.
 * In a real scenario, this would verify a JWT and attach decoded user info to req.user.
 */

const authMiddleware = (req, res, next) => {
  // Read identity override from header (if provided by frontend switcher)
  const overrideUserId = req.headers['x-user-id'];

  console.log(`[AuthMiddleware] Incoming Request: ${req.method} ${req.url}`);
  console.log(`[AuthMiddleware] X-User-Id Header: ${overrideUserId || 'NONE (Defaulting to Admin)'}`);

  // Dummy authenticated user
  req.user = {
    userId: overrideUserId || '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
  };
  next();
};

module.exports = authMiddleware;
