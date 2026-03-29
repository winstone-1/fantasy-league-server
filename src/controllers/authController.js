const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
const register = async (req, res) => {
  try {
    console.log('register hit')
    const { username, email, password } = req.body
    console.log('body:', req.body)
    
    const userExists = await User.findOne({ email })
    console.log('userExists:', userExists)
    
    if (userExists) return res.status(400).json({ message: 'User already exists' })

    console.log('creating user...')
    const user = await User.create({ username, email, password })
    console.log('user created:', user)
    
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    console.log('ERROR:', error)
    res.status(500).json({ message: error.message })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user)
}

module.exports = { register, login, getMe }