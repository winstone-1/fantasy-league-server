import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'League' },
  players: [{
    position: String,
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    x: { type: Number },
    y: { type: Number },
  }],
  totalPoints:  { type: Number, default: 0 },
  wins:         { type: Number, default: 0 },  // ← add
  losses:       { type: Number, default: 0 },  // ← add
  draws:        { type: Number, default: 0 },  // ← add
  weeklyPoints: { type: Number, default: 0 },  // ← add
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);