const express = require('express')
const router = express.Router({ mergeParams: true })
const protect = require('../middleware/protect')
const requireLeagueAdmin = require('../middleware/Requireleagueadmin')
const { createMatch, getLeagueMatches } = require('../controllers/matchController')

router.use(protect)

router.post('/', requireLeagueAdmin, createMatch)
router.get('/',  getLeagueMatches)

module.exports = router