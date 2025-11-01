const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');

router.post('/login', authCtrl.login);
// create user by srcoach
router.post('/register', protect, allowRoles('seniorCoach'), authCtrl.registerBySrCoach);

module.exports = router;
