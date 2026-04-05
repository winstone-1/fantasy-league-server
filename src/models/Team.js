import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'League' },
  players: [{
    position: String,       // slot id e.g. 'GK', 'CB1', 'NBA_PG'
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    x: { type: Number },    // percentage 0-100 from left (free drag position)
    y: { type: Number },    // percentage 0-100 from top  (free drag position)
  }],
  totalPoints: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);