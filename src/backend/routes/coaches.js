const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const coachCtrl = require('../controllers/coachController');

// coach endpoints
router.get('/me', protect, allowRoles('coach'), coachCtrl.getCoachProfile);
router.get('/me/students', protect, allowRoles('coach'), coachCtrl.listStudents);
router.post('/attendance', protect, allowRoles('coach'), coachCtrl.markAttendance);
router.post('/fee', protect, allowRoles('coach'), coachCtrl.markFee);

module.exports = router;
