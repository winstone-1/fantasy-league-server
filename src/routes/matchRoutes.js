import express from 'express';
import protect from '../middleware/protect.js';
import requireLeagueAdmin from '../middleware/Requireleagueadmin.js';
import {
  createMatch,
  getLeagueMatches,
  getLiveMatches,
  getMatch,
  updateScore,
  updateStatus
} from '../controllers/matchController.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

// League-scoped (mounted at /api/leagues/:id/matches)
router.post('/',     requireLeagueAdmin, createMatch);
router.get('/',      getLeagueMatches);

// Global match routes (mounted at /api/matches)
router.get('/live',          getLiveMatches);
router.get('/:id',           getMatch);
router.put('/:id/score',     updateScore);
router.patch('/:id/status',  updateStatus);

export default router;