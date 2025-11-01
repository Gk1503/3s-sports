const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const studentCtrl = require('../controllers/studentController');

// student view own profile
router.get('/me', protect, allowRoles('student'), studentCtrl.getMyProfile);

// coaches and srcoach fetch student by id
router.get('/:id', protect, allowRoles('coach','seniorCoach'), studentCtrl.getStudentById);

// update student (srcoach or student themself or coach if permitted)
router.patch('/:id', protect, allowRoles('student','coach','seniorCoach'), studentCtrl.updateStudent);

module.exports = router;
