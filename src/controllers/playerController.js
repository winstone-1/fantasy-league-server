import Player from '../models/Player.js';
import { searchNBAPlayers, searchSoccerPlayers } from '../services/sportsApiService.js';

// GET /api/players/search?q=lebron&sport=basketball
const searchPlayers = async (req, res) => {
  try {
    const { q, sport } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query is required' });
    if (!sport) return res.status(400).json({ message: 'Sport is required (basketball or soccer)' });

    // check cache first
    const cached = await Player.find({
      sport,
      name: { $regex: q, $options: 'i' }
    }).limit(10);

    if (cached.length > 0) {
      return res.json({ source: 'cache', players: cached });
    }

    // fetch from external API
    let players = [];
    if (sport === 'basketball') players = await searchNBAPlayers(q);
    if (sport === 'soccer') players = await searchSoccerPlayers(q);

    // upsert into MongoDB cache
    const saved = await Promise.all(
      players.map(p =>
        Player.findOneAndUpdate(
          { externalId: p.externalId, sport: p.sport },
          p,
          { upsert: true, new: true }
        )
      )
    );

    res.json({ source: 'api', players: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/players/:id
const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/players/sport/:sport
const getPlayersBySport = async (req, res) => {
  try {
    const players = await Player.find({ sport: req.params.sport }).limit(50);
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { searchPlayers, getPlayer, getPlayersBySport };