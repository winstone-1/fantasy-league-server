import Match from '../models/Match.js';
import League from '../models/League.js';

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

const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('league', 'name sport');
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/matches/:id/score
const updateScore = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('league');
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (!match.league.commissioner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the commissioner can update scores' });
    }

    const { homeScore, awayScore, minute } = req.body;
    if (homeScore !== undefined) match.homeScore = homeScore;
    if (awayScore !== undefined) match.awayScore = awayScore;
    if (minute    !== undefined) match.minute    = minute;
    await match.save();

    res.json(match);
  } catch (error) {
    console.error('UPDATE SCORE ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/matches/:id/status
// PATCH /api/matches/:id/status
const updateStatus = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('league')
    if (!match) return res.status(404).json({ message: 'Match not found' })

    // league may not be populated if it was deleted — guard against it
    if (!match.league) return res.status(404).json({ message: 'League not found' })

    // Some Match docs may store commissioner differently — check both
    const commissionerId = match.league.commissioner?._id || match.league.commissioner
    if (!commissionerId) return res.status(403).json({ message: 'No commissioner found' })

    if (commissionerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the commissioner can update match status' })
    }

    const { status, minute } = req.body
    if (status !== undefined) match.status = status
    if (minute !== undefined) match.minute = Number(minute)
    await match.save()

    res.json(match)
  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

export { createMatch, getLeagueMatches, getLiveMatches, getMatch, updateScore, updateStatus };