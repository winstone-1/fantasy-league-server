import Match from '../models/Match.js';
import League from '../models/League.js';
import Team from '../models/Team.js';

// ─── Helper: recalculate & persist standings for a league ───────────────────
const recalculateStandings = async (leagueId) => {
  const matches = await Match.find({ league: leagueId, status: 'ft' })
    .populate('homeTeam', 'name owner')
    .populate('awayTeam', 'name owner');

  const table = {};

  const ensureEntry = (team) => {
    const id = team._id.toString();
    if (!table[id]) {
      table[id] = {
        teamId:      team._id,
        teamName:    team.name,
        owner:       team.owner,
        wins:        0,
        losses:      0,
        draws:       0,
        totalPoints: 0,
        rank:        0,
      };
    }
  };

  for (const match of matches) {
    if (!match.homeTeam || !match.awayTeam) continue;

    ensureEntry(match.homeTeam);
    ensureEntry(match.awayTeam);

    const homeId = match.homeTeam._id.toString();
    const awayId = match.awayTeam._id.toString();
    const h = match.homeScore ?? 0;
    const a = match.awayScore ?? 0;

    if (h > a) {
      table[homeId].wins++;        table[homeId].totalPoints += 3;
      table[awayId].losses++;
    } else if (a > h) {
      table[awayId].wins++;        table[awayId].totalPoints += 3;
      table[homeId].losses++;
    } else {
      table[homeId].draws++;       table[homeId].totalPoints += 1;
      table[awayId].draws++;       table[awayId].totalPoints += 1;
    }
  }

  const standings = Object.values(table)
    .sort((a, b) => b.totalPoints - a.totalPoints || b.wins - a.wins)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  await League.findByIdAndUpdate(leagueId, { standings });
  return standings;
};

// ─── Controllers ────────────────────────────────────────────────────────────

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
// Always recalculates standings after saving — covers live score updates
// and retroactive corrections to completed matches.
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

    // Recalculate standings any time a score changes (catches ft corrections too)
    if (match.status === 'ft') {
      await recalculateStandings(match.league._id);
    }

    res.json(match);
  } catch (error) {
    console.error('UPDATE SCORE ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/matches/:id/status
// Triggers standings recalculation when a match is marked FT.
const updateStatus = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('league');
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (!match.league) return res.status(404).json({ message: 'League not found' });

    const commissionerId = match.league.commissioner?._id || match.league.commissioner;
    if (!commissionerId) return res.status(403).json({ message: 'No commissioner found' });

    if (commissionerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the commissioner can update match status' });
    }

    const { status, minute } = req.body;
    if (status !== undefined) match.status = status;
    if (minute !== undefined) match.minute = Number(minute);
    await match.save();

    // Recalculate standings the moment a match is marked full time
    if (status === 'ft') {
      await recalculateStandings(match.league._id);
    }

    res.json(match);
  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export { createMatch, getLeagueMatches, getLiveMatches, getMatch, updateScore, updateStatus };