const express = require('express')
const router = express.Router({ mergeParams: true })
const protect = require('../middleware/protect')
const { getStandings } = require('../controllers/standingsController')

router.use(protect)

router.get('/', getStandings)

module.exports = router