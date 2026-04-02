import crypto from 'crypto';
import League from '../models/League.js';

// POST /api/leagues
const createLeague = async (req, res) => {
  try {
    const { name, sport, maxTeams, isPrivate, season } = req.body;
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const league = await League.create({
      name,
      sport,
      maxTeams,
      isPrivate,
      season,
      inviteCode,
      commissioner: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json(league);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/leagues
const getMyLeagues = async (req, res) => {
  try {
    const leagues = await League.find({ members: req.user._id })
      .populate('commissioner', 'username email')
      .populate('members', 'username email');
    res.json(leagues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/leagues/:id
const getLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.id)
      .populate('commissioner', 'username email')
      .populate('members', 'username email');

    if (!league) return res.status(404).json({ message: 'League not found' });

    const isMember = league.members.some(m => m._id.equals(req.user._id));
    if (!isMember) return res.status(403).json({ message: 'Not a member of this league' });

    res.json(league);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/leagues/:id
const updateLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });

    if (!league.commissioner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the commissioner can update this league' });
    }

    const updated = await League.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/leagues/:id
const deleteLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });

    if (!league.commissioner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the commissioner can delete this league' });
    }

    await league.deleteOne();
    res.json({ message: 'League deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// POST /api/leagues/join  (by invite code)
const joinLeagueByCode = async (req, res) => {
  try {
    const { inviteCode } = req.body
    if (!inviteCode) return res.status(400).json({ message: 'Invite code required' })

    const league = await League.findOne({ inviteCode: inviteCode.toUpperCase() })
    if (!league) return res.status(404).json({ message: 'League not found' })

    const alreadyMember = league.members.some(m => m.equals(req.user._id))
    if (alreadyMember) return res.status(400).json({ message: 'Already a member' })

    if (league.members.length >= league.maxTeams)
      return res.status(400).json({ message: 'League is full' })

    league.members.push(req.user._id)
    await league.save()

    res.json({ message: 'Joined league successfully', league })
  } catch (error) {
    console.error('JOIN BY CODE ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}
// POST /api/leagues/:id/join
const joinLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });

    const alreadyMember = league.members.some(m => m.equals(req.user._id));
    if (alreadyMember) return res.status(400).json({ message: 'Already a member' });

    if (league.members.length >= league.maxTeams) {
      return res.status(400).json({ message: 'League is full' });
    }

    if (league.isPrivate && req.body.inviteCode !== league.inviteCode) {
      return res.status(403).json({ message: 'Invalid invite code' });
    }

    league.members.push(req.user._id);
    await league.save();
    res.json({ message: 'Joined league successfully', league });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/leagues/:id/leave
const leaveLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });

    if (league.commissioner.equals(req.user._id)) {
      return res.status(400).json({ message: 'Commissioner cannot leave — delete the league instead' });
    }

    league.members = league.members.filter(m => !m.equals(req.user._id));
    await league.save();
    res.json({ message: 'Left league successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createLeague, getMyLeagues, getLeague, updateLeague, deleteLeague, joinLeague, leaveLeague, joinLeagueByCode };