const express = require('express')
const router = express.Router()
const { register, login, getMe, updateMe, googleAuth } = require('../controllers/authController')
const protect = require('../middleware/protect')

router.post('/register', register)
router.post('/login',    login)
router.post('/google',   googleAuth)
router.get('/me',        protect, getMe)
router.put('/me',        protect, updateMe)  // for profile name edit

module.exports = router