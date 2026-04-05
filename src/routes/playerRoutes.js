import express from 'express';
import protect from '../middleware/protect.js';
import { searchPlayers, getPlayer, getPlayersBySport, createCustomPlayer } from '../controllers/playerController.js';

const router = express.Router();

router.use(protect);

router.get('/search',       searchPlayers);
router.get('/sport/:sport', getPlayersBySport);
router.post('/custom',      createCustomPlayer);  // must be before /:id
router.get('/:id',          getPlayer);

export default router;