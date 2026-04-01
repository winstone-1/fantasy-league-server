const express = require('express')
const router = express.Router({ mergeParams: true })
const protect = require('../middleware/protect')
const Requireleagueadmin = require('../middleware/Requireleagueadmin')
const { createMatch, getLeagueMatches } = require('../controllers/matchController')

router.use(protect)

router.post('/', Requireleagueadmin, createMatch)
router.get('/',  getLeagueMatches)

module.exports = router