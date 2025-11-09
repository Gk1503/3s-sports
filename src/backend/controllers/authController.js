const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
require('dotenv').config();

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'username and password required' });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = createToken(user);

  res.json({
    _id: user._id,
    username: user.username,
    role: user.role,
    token,
  });
};


// This register route is for SRCOACH to create users; public registration is disabled
exports.registerBySrCoach = async (req, res) => {
  // req.user must be seniorCoach (enforced in route)
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: 'username, password, role required' });
  if (!['student', 'coach', 'seniorCoach'].includes(role)) return res.status(400).json({ message: 'invalid role' });

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: 'username already exists' });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    passwordHash,
    role,
    createdBy: req.user._id
  });

  await newUser.save();

  res.status(201).json({ message: 'User created', userId: newUser._id });
};

// Public student self-registration (no fees settings here)
exports.registerStudentPublic = async (req, res) => {
  try {
    // Handle multer errors (file upload errors)
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    // Handle FormData - extract fields from req.body
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      address,
      batch,
      parentName,
      parentPhone,
      skills, // JSON string from FormData
      extraInfo,
    } = req.body;

    // Validate required fields
    if (!username || !password || !firstName) {
      return res.status(400).json({ message: 'username, password, and firstName are required' });
    }

    // Check if username already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User account
    const user = await User.create({
      username,
      passwordHash,
      role: 'student',
      createdBy: null,
    });

    // Handle profile photo upload
    let profilePhotoUrl = null;
    if (req.file) {
      profilePhotoUrl = `/uploads/profile-photos/${req.file.filename}`;
    }

    // Parse skills JSON string if it's a string, otherwise use as is
    let skillsData = {};
    if (skills) {
      try {
        skillsData = typeof skills === 'string' ? JSON.parse(skills) : skills;
      } catch (parseErr) {
        console.error('Error parsing skills:', parseErr);
        skillsData = {};
      }
    }

    // Build skills object with new structure
    const skillsObj = {
      role: skillsData?.role || null,
      battingHand: skillsData?.battingHand || null,
      bowlingHand: skillsData?.bowlingHand || null,
      bowlingType: skillsData?.bowlingType || null,
      wicketKeeper: !!skillsData?.wicketKeeper || false,
      // Legacy support
      handedness: skillsData?.handedness || skillsData?.battingHand || skillsData?.bowlingHand || null,
      tags: Array.isArray(skillsData?.tags) ? skillsData.tags : [],
    };

    // Create Student profile
    const student = await Student.create({
      user: user._id,
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      gender: gender || null,
      dob: dob || null,
      address: address || null,
      batch: batch || null,
      parentName: parentName || null,
      parentPhone: parentPhone || null,
      profilePhotoUrl: profilePhotoUrl,
      skills: skillsObj,
      extraInfo: extraInfo || null,
      monthlyFee: 0, // Default to 0, can be set by senior coach later
      feeDuration: '1m', // Default duration
      registrationSource: 'self',
    });

    return res.status(201).json({
      message: 'Student registered successfully',
      userId: user._id,
      studentId: student._id,
      username: user.username,
    });
  } catch (err) {
    console.error('Public student registration error:', err);
    return res.status(500).json({ 
      message: 'Failed to register student',
      error: err.message 
    });
  }
};
