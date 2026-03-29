const express = require('express')
const router = express.Router({ mergeParams: true })
const protect = require('../middleware/protect')
const { createMatch, getLeagueMatches, getLiveMatches, getMatch, updateScore } = require('../controllers/matchController')

router.use(protect)

router.get('/live',              getLiveMatches)
router.get('/:matchId',          getMatch)
router.put('/:matchId/score',    updateScore)

module.exports = router