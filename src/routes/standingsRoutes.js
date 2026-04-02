import express from 'express';
import protect from '../middleware/protect.js';
import { getStandings } from '../controllers/standingsController.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/', getStandings);

export default router;