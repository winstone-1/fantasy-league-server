require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const authRoutes         = require('./routes/authRoutes')
const leagueRoutes       = require('./routes/leagueRoutes')
const playerRoutes       = require('./routes/playerRoutes')
const teamRoutes         = require('./routes/teamRoutes')
const standingsRoutes    = require('./routes/standingsRoutes')
const matchRoutes        = require('./routes/matchRoutes')
const leagueMatchRoutes  = require('./routes/leagueMatchRoutes')

const connectDB = require('./config/db')
connectDB()

const app = express()

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://fantasy-league-client.vercel.app',
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