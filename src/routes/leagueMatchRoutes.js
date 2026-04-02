import express from 'express';
import protect from '../middleware/protect.js';
import requireLeagueAdmin from '../middleware/Requireleagueadmin.js';
import { createMatch, getLeagueMatches } from '../controllers/matchController.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', requireLeagueAdmin, createMatch);
router.get('/',  getLeagueMatches);

export default router;