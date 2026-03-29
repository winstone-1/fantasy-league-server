const express = require('express')
const router = express.Router({ mergeParams: true })
const protect = require('../middleware/protect')
const { createTeam, getTeams, getTeam, addPlayer, removePlayer } = require('../controllers/teamController')

router.use(protect)

router.post('/',                          createTeam)
router.get('/',                           getTeams)
router.get('/:teamId',                    getTeam)
router.post('/:teamId/players',           addPlayer)
router.delete('/:teamId/players/:playerId', removePlayer)

module.exports = router