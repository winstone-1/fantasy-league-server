import mongoose from 'mongoose';

const standingEntrySchema = new mongoose.Schema({
  teamId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamName:    { type: String },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  wins:        { type: Number, default: 0 },
  losses:      { type: Number, default: 0 },
  draws:       { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  rank:        { type: Number, default: 0 },
}, { _id: false });

const leagueSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  sport:        { type: String, enum: ['football', 'basketball', 'baseball', 'soccer'], required: true },
  commissioner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxTeams:     { type: Number, default: 10 },
  isPrivate:    { type: Boolean, default: false },
  inviteCode:   { type: String, unique: true },
  season:       { type: String, default: '2025' },
  standings:    [standingEntrySchema],
}, { timestamps: true });

export default mongoose.model('League', leagueSchema);