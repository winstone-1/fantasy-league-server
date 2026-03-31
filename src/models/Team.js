const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  league:      { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true },
  players: [{
    position: String, // e.g., 'GK', 'CB1', 'NBA_PG'
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
  }],
  totalPoints: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('Team', teamSchema)