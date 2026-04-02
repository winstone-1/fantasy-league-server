import Team from '../models/Team.js';
import League from '../models/League.js';

// GET /api/leagues/:id/standings
const getStandings = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });

    const isMember = league.members.some(m => m.equals(req.user._id));
    if (!isMember) return res.status(403).json({ message: 'Not a member of this league' });

    const teams = await Team.find({ league: req.params.id })
      .populate('owner', 'username email')
      .populate('players')
      .sort({ totalPoints: -1 });

    const standings = teams.map((team, index) => ({
      rank:        index + 1,
      teamId:      team._id,
      name:        team.name,
      owner:       team.owner,
      players:     team.players.length,
      totalPoints: team.totalPoints
    }));

    res.json({ league: league.name, sport: league.sport, standings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getStandings };