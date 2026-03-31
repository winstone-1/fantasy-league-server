const express = require('express')
const router = express.Router({ mergeParams: true })
const protect = require('../middleware/protect')
const { createTeam, getTeams, getTeam, addPlayer, removePlayer, updateTeamRoster, updateTeam  } = require('../controllers/teamController')

router.use(protect)

router.post('/',                          createTeam)
router.get('/',                           getTeams)
router.get('/:teamId',                    getTeam)
router.post('/:teamId/players',           addPlayer)
router.delete('/:teamId/players/:playerId', removePlayer)
router.put('/:teamId',                     updateTeamRoster)
router.put('/:teamId/update',              updateTeam)

module.exports = router