import express from 'express';
import protect from '../middleware/protect.js';
import League from '../models/League.js';
import {
  createLeague, getMyLeagues, getLeague,
  updateLeague, deleteLeague, joinLeague, leaveLeague,
  joinLeagueByCode
} from '../controllers/leagueController.js';

const router = express.Router();

router.use(protect);

router.post('/',                createLeague);
router.get('/',                 getMyLeagues);
router.post('/join',            joinLeagueByCode);   // ← BEFORE /:id
router.get('/:id',              getLeague);
router.put('/:id',              updateLeague);
router.delete('/:id',           deleteLeague);
router.post('/:id/join',        joinLeague);
router.delete('/:id/leave',     leaveLeague);

export default router;