import Match from '../models/Match.js';
import League from '../models/League.js';

// POST /api/leagues/:id/matches  (commissioner only)
const createMatch = async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });

    if (!league.commissioner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the commissioner can schedule matches' });
    }

    const { homeTeam, awayTeam, week, startTime } = req.body;
    const match = await Match.create({
      league: req.params.id,
      homeTeam,
      awayTeam,
      week,
      startTime
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/leagues/:id/matches
const getLeagueMatches = async (req, res) => {
  try {
    const matches = await Match.find({ league: req.params.id })
      .populate('homeTeam', 'name totalPoints')
      .populate('awayTeam', 'name totalPoints')
      .sort({ startTime: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/matches/live
const getLiveMatches = async (req, res) => {
  try {
    const matches = await Match.find({ status: 'live' })
      .populate('homeTeam', 'name totalPoints')
      .populate('awayTeam', 'name totalPoints')
      .populate('league', 'name sport');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/matches/:matchId
const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId)
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('league', 'name sport');
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/matches/:matchId/score  (commissioner only)
const updateScore = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId).populate('league');
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (!match.league.commissioner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the commissioner can update scores' });
    }

    const { homeScore, awayScore, status } = req.body;
    match.homeScore = homeScore ?? match.homeScore;
    match.awayScore = awayScore ?? match.awayScore;
    match.status    = status    ?? match.status;
    await match.save();

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createMatch, getLeagueMatches, getLiveMatches, getMatch, updateScore };