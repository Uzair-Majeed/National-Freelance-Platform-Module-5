const pool = require('../config/db');

const simulateSession = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    console.log(`[Auth] Attempting simulation for: ${email}`);

    // Find or create user - Using workspace_users
    let result = await pool.query('SELECT * FROM workspace_users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log(`[Auth] User not found, creating new entry for: ${email}`);
      // Create new user in workspace_users
      result = await pool.query(
        'INSERT INTO workspace_users (email) VALUES ($1) RETURNING *',
        [email]
      );
    }

    const user = result.rows[0];
    console.log(`[Auth] Session established for user_id: ${user.user_id}`);
    
    res.status(200).json({ 
      success: true, 
      data: { 
        user_id: user.user_id, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error('Auth Simulation Error Detailed:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Internal Server Error' 
    });
  }
};

module.exports = { simulateSession };
