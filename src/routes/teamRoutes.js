import express from 'express';
import protect from '../middleware/protect.js';
import { createTeam, getTeams, getTeam, addPlayer, removePlayer, updateTeamRoster, updateTeam } from '../controllers/teamController.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/',                          createTeam);
router.get('/',                           getTeams);
router.get('/:teamId',                    getTeam);
router.post('/:teamId/players',           addPlayer);
router.delete('/:teamId/players/:playerId', removePlayer);
router.put('/:teamId',                     updateTeamRoster);
router.put('/:teamId/update',              updateTeam);

export default router;