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
// POST /leagues/join
router.post('/join', protect, async (req, res) => {
  try {
    const { inviteCode } = req.body
    const league = await League.findOne({ inviteCode: inviteCode.toUpperCase() })
    if (!league) return res.status(404).json({ message: 'League not found' })

    const alreadyMember = league.members.some(
      m => m.toString() === req.user._id.toString()
    )
    if (alreadyMember) return res.status(400).json({ message: 'Already a member' })

    if (league.members.length >= league.maxTeams)
      return res.status(400).json({ message: 'League is full' })

    league.members.push(req.user._id)
    await league.save()

    res.json({ message: 'Joined successfully', league })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})
router.post('/:id/join',      joinLeague);
router.delete('/:id/leave',   leaveLeague);

export default router;