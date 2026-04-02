import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import leagueRoutes from './routes/leagueRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import standingsRoutes from './routes/standingsRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import leagueMatchRoutes from './routes/leagueMatchRoutes.js';

import connectDB from './config/db.js';
connectDB();

const app = express()

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL_PROD,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://fantasy-league-client.vercel.app',
  'https://fantasy-league-server-production.up.railway.app'
]

// 1. Move CORS to the very top 
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));

app.options('*', cors()); // Essential for Preflight

// 2. Adjust Helmet to be less restrictive for OAuth
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Better than 'false'
  contentSecurityPolicy: false, // Temporary: Disable this to see if the crash stops
}));

app.use(morgan('dev'));
app.use(express.json());

// Must come before other middleware so preflight OPTIONS requests are handled
app.options('*', cors())


// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',                  authRoutes)
app.use('/api/leagues',               leagueRoutes)
app.use('/api/players',               playerRoutes)
app.use('/api/leagues/:id/teams',     teamRoutes)
app.use('/api/leagues/:id/standings', standingsRoutes)
app.use('/api/matches',               matchRoutes)
app.use('/api/leagues/:id/matches',   leagueMatchRoutes)

app.get('/', (req, res) => res.json({ message: 'Fantasy League API is running' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))