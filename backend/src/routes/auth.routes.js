const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/session', authController.simulateSession);
router.get('/test', (req, res) => res.json({ message: 'Auth routes are working!' }));

module.exports = router;
