const express = require('express')
const router = express.Router({ mergeParams: true })
const protect = require('../middleware/protect')
const requireLeagueAdmin = require('../middleware/requireLeagueAdmin')
const {
  createMatch,
  getLeagueMatches,
  getLiveMatches,
  getMatch,
  updateScore
} = require('../controllers/matchController')

router.use(protect)

// League-scoped routes (mounted at /leagues/:leagueId/matches)
router.post('/',               requireLeagueAdmin, createMatch)
router.get('/',                getLeagueMatches)

// Global / match-specific routes
router.get('/live',            getLiveMatches)
router.get('/:matchId',        getMatch)
router.put('/:matchId/score',  requireLeagueAdmin, updateScore)

module.exports = router