const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
