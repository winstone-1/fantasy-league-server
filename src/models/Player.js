import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  externalId:  { type: String },
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
  stats:       { type: mongoose.Schema.Types.Mixed, default: {} },
  isCustom:    { type: Boolean, default: false },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Only enforce unique index on non-custom players
playerSchema.index(
  { externalId: 1, sport: 1 },
  { unique: true, partialFilterExpression: { isCustom: { $ne: true } } }
);

export default mongoose.model('Player', playerSchema);