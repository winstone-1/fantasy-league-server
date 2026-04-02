import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Consistent user shape returned in every auth response
const userPayload = (user) => ({
  _id:       user._id,
  username:  user.username,
  email:     user.email,
  role:      user.role,
  createdAt: user.createdAt,
  token:     generateToken(user._id)
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    res.status(201).json(userPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json(userPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  // req.user is set by protect middleware — re-fetch to get latest role/data
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// PUT /api/auth/me — update display name
const updateMe = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username?.trim()) {
      return res.status(400).json({ message: 'Username cannot be empty' });
    }

    const taken = await User.findOne({ username: username.trim(), _id: { $ne: req.user._id } });
    if (taken) return res.status(400).json({ message: 'Username already taken' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username: username.trim() },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/google
const googleAuth = async (req, res) => {
  try {
    const { email, username, photo } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: username || email.split('@')[0],
        email,
        password: Math.random().toString(36).slice(-10) + '!A1',
        role: 'member'
      });
    }

    res.json({
      ...userPayload(user),
      photo // photo comes from Firebase, not stored in DB
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { register, login, getMe, updateMe, googleAuth };