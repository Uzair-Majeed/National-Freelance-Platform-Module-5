/**
 * MIDDLEWARE LAYER - AuthMiddleware
 * Dummy middleware to simulate an authenticated user since the User Module is external.
 * In a real scenario, this would verify a JWT and attach decoded user info to req.user.
 */

const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
  // Read identity override from header (if provided by frontend switcher)
  const overrideUserId = req.headers['x-user-id'];
  const userId = overrideUserId ? parseInt(overrideUserId) : 1;

  try {
    const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      console.warn(`[AuthMiddleware] User ID ${userId} not found in Centralized DB.`);
      req.user = { userId, email: 'unknown@example.com' };
    } else {
      req.user = {
        userId: user.id,
        email: user.email,
      };
    }
    next();
  } catch (err) {
    console.error('[AuthMiddleware] DB Error:', err.message);
    req.user = { userId, email: 'error@example.com' };
    next();
  }
};

module.exports = authMiddleware;
