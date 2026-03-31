const Team = require('../models/Team')
const League = require('../models/League')
const Player = require('../models/Player')

// POST /api/leagues/:id/teams
const createTeam = async (req, res) => {
  try {
    const league = await League.findById(req.params.id)
    if (!league) return res.status(404).json({ message: 'League not found' })

    const isMember = league.members.some(m => m.equals(req.user._id))
    if (!isMember) return res.status(403).json({ message: 'Not a member of this league' })

    const existingTeam = await Team.findOne({ league: req.params.id, owner: req.user._id })
    if (existingTeam) return res.status(400).json({ message: 'You already have a team in this league' })

    const team = await Team.create({
      name: req.body.name,
      owner: req.user._id,
      league: req.params.id
    })

    res.status(201).json(team)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/leagues/:id/teams
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ league: req.params.id })
      .populate('owner', 'username email')
      .populate('players')
    res.json(teams)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/leagues/:id/teams/:teamId
const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('owner', 'username email')
      .populate('players')
    if (!team) return res.status(404).json({ message: 'Team not found' })
    res.json(team)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/leagues/:id/teams/:teamId/players
const addPlayer = async (req, res) => {
  try {
    const { playerId, position } = req.body; // Get position from frontend
    const team = await Team.findById(req.params.teamId);

    // Remove any player already in that specific slot (to allow overwriting)
    team.players = team.players.filter(p => p.position !== position);

    // Add the new player to that slot
    team.players.push({ player: playerId, position: position });
    
    await team.save();
    res.json({ message: 'Player assigned to slot', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE /api/leagues/:id/teams/:teamId/players/:playerId
const removePlayer = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    if (!team.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the team owner can remove players' })
    }

    team.players = team.players.filter(p => !p.equals(req.params.playerId))
    await team.save()

    res.json({ message: 'Player removed', team })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createTeam, getTeams, getTeam, addPlayer, removePlayer }