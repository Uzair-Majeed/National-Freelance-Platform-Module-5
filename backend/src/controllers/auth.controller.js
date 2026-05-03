const pool = require('../config/db');

const simulateSession = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    console.log(`[Auth] Attempting simulation for: ${email}`);

    // Find or create user - Using Centralized 'users' table
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log(`[Auth] User not found, creating new entry for: ${email}`);
      // Create new user in centralized users table
      result = await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, 'dummy_hash', email.split('@')[0], 'User']
      );
    }

    const user = result.rows[0];
    console.log(`[Auth] Session established for id: ${user.id}`);
    
    res.status(200).json({ 
      success: true, 
      data: { 
        user_id: user.id, 
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
