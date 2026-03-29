const express = require('express')
const router = express.Router({ mergeParams: true })
const protect = require('../middleware/protect')
const { createMatch, getLeagueMatches } = require('../controllers/matchController')

router.use(protect)

router.post('/', createMatch)
router.get('/',  getLeagueMatches)

module.exports = router