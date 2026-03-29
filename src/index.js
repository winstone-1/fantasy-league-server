const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const authRoutes = require('./routes/authRoutes')
require('dotenv').config()

const connectDB = require('./config/db')

connectDB()

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Fantasy League API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))