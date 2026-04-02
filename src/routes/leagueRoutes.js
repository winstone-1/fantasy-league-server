import express from 'express';
import protect from '../middleware/protect.js';
import {
  createLeague, getMyLeagues, getLeague,
  updateLeague, deleteLeague, joinLeague, leaveLeague
} from '../controllers/leagueController.js';

const router = express.Router();

router.use(protect);

router.post('/',              createLeague);
router.get('/',               getMyLeagues);
router.get('/:id',            getLeague);
router.put('/:id',            updateLeague);
router.delete('/:id',         deleteLeague);
router.post('/:id/join',      joinLeague);
router.delete('/:id/leave',   leaveLeague);

export default router;