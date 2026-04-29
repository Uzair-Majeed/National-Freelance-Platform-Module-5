/**
 * EXTERNAL INTEGRATION LAYER - AuthAdapter
 * Abstracts integration with the external Authentication Provider.
 * The core business logic is decoupled from any specific auth implementation.
 */

/**
 * Verifies a JWT token and returns the decoded user payload.
 * @param {string} token - JWT token from Authorization header
 * @returns {Promise<Object>} Decoded user payload { userId, email, globalRole }
 */
const verifyToken = async (token) => {
  // TODO: Integrate with Auth Module (e.g., JWT verify, OAuth2 introspection)
  throw new Error('AuthAdapter.verifyToken: Not yet integrated with Auth Module');
};

/**
 * Validates that a user exists in the system.
 * @param {string} userId - User UUID
 * @returns {Promise<boolean>}
 */
const validateUser = async (userId) => {
  // TODO: Call User Module API to validate user existence
  throw new Error('AuthAdapter.validateUser: Not yet integrated with User Module');
};

module.exports = { verifyToken, validateUser };
