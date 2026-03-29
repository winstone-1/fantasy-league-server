const mongoose = require('mongoose')

const leagueSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  sport:        { type: String, enum: ['football', 'basketball', 'baseball', 'soccer'], required: true },
  commissioner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxTeams:     { type: Number, default: 10 },
  isPrivate:    { type: Boolean, default: false },
  inviteCode:   { type: String, unique: true },
  season:       { type: String, default: '2025' }
}, { timestamps: true })

module.exports = mongoose.model('League', leagueSchema)