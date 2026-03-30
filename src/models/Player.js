const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  externalId:  { type: String, required: true },
  sport:       { type: String, enum: ['basketball', 'soccer'], required: true },
  name:        { type: String, required: true },
  firstname:   { type: String },
  lastname:    { type: String },
  team:        { type: String },
  position:    { type: String },
  nationality: { type: String },
  photo:       { type: String },
  height:      { type: String },
  weight:      { type: String },
  stats:       { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true })


playerSchema.index({ externalId: 1, sport: 1 }, { unique: true })

module.exports = mongoose.model('Player', playerSchema)