import express from 'express';
import { register, login, getMe, updateMe, googleAuth } from '../controllers/authController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.post('/register', register);
router.post('/login',    login);
router.post('/google',   googleAuth);
router.get('/me',        protect, getMe);
router.put('/me',        protect, updateMe);  // for profile name edit

export default router;