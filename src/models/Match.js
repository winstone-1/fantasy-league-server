import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  league:     { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true },
  homeTeam:   { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  awayTeam:   { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  homeScore:  { type: Number, default: 0 },
  awayScore:  { type: Number, default: 0 },
  status:     { type: String, enum: ['scheduled', 'live', 'ht', 'ft', 'cancelled', 'completed'], default: 'scheduled' },
  minute:     { type: Number, default: 0 },
  week:       { type: Number, required: true },
  startTime:  { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);