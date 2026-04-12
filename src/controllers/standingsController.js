import League from '../models/League.js';

// GET /api/leagues/:id/standings
const getStandings = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });

    const isMember = league.members.some(m => m.equals(req.user._id));
    if (!isMember) return res.status(403).json({ message: 'Not a member of this league' });

    res.json({
      league:    league.name,
      sport:     league.sport,
      standings: league.standings ?? [],  // already has wins/losses/draws/rank/totalPoints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getStandings };