import express from 'express';
import protect from '../middleware/protect.js';
import requireLeagueAdmin from '../middleware/Requireleagueadmin.js';
import {
  createMatch,
  getLeagueMatches,
  getLiveMatches,
  getMatch,
  updateScore
} from '../controllers/matchController.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

// League-scoped routes (mounted at /leagues/:leagueId/matches)
router.post('/',               requireLeagueAdmin, createMatch);
router.get('/',                getLeagueMatches);

// Global / match-specific routes
router.get('/live',            getLiveMatches);
router.get('/:matchId',        getMatch);
router.put('/:matchId/score',  requireLeagueAdmin, updateScore);

export default router;