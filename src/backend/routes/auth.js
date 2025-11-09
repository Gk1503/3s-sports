const express = require('express');
const multer = require('multer');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const upload = require('../middleware/upload');

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

router.post('/login', authCtrl.login);
// create user by srcoach
router.post('/register', protect, allowRoles('seniorCoach'), authCtrl.registerBySrCoach);
// public student self-registration with file upload support
router.post('/register-student', upload.single('profilePhoto'), handleMulterError, authCtrl.registerStudentPublic);

module.exports = router;
