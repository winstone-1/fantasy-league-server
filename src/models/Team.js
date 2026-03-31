const mongoose = require('mongoose')

// models/Team.js
const teamSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'League' },
  // CHANGE THIS:
  players: [{
    position: String, // Stores 'GK', 'CB1', 'NBA_PG', etc.
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
  }],
  totalPoints: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('Team', teamSchema)