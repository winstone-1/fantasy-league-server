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

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow both local dev and deployed Vercel frontend.
// Add any preview URLs to the array as needed.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL, 
].filter(Boolean) // remove undefined if CLIENT_URL not set

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server / curl requests (no origin)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Handle preflight for all routes
app.options('*', cors())

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',                    authRoutes)
app.use('/api/leagues',                 leagueRoutes)
app.use('/api/players',                 playerRoutes)
app.use('/api/leagues/:id/teams',       teamRoutes)
app.use('/api/leagues/:id/standings',   standingsRoutes)
app.use('/api/matches',                 matchRoutes)
app.use('/api/leagues/:id/matches',     leagueMatchRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Fantasy League API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))