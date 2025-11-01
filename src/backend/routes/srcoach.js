const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const srCtrl = require('../controllers/srCoachController');

// All protected: only seniorCoach
router.post('/students', protect, allowRoles('seniorCoach'), srCtrl.createStudentWithUser);
router.post('/coaches', protect, allowRoles('seniorCoach'), srCtrl.createCoachWithUser);

router.get('/students', protect, allowRoles('seniorCoach'), srCtrl.listMyStudents);
router.get('/coaches', protect, allowRoles('seniorCoach'), srCtrl.listMyCoaches);

router.put('/students/:id', protect, allowRoles('seniorCoach'), srCtrl.updateUserBySrCoach);
router.put('/coaches/:id', protect, allowRoles('seniorCoach'), srCtrl.updateUserBySrCoach);

router.delete('/students/:id', protect, allowRoles('seniorCoach'), srCtrl.deleteUserBySrCoach);
router.delete('/coaches/:id', protect, allowRoles('seniorCoach'), srCtrl.deleteUserBySrCoach);

router.get('/report', protect, allowRoles('seniorCoach'), srCtrl.overallReport);

module.exports = router;
