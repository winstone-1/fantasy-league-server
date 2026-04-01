const express = require('express')
const router = express.Router()
const protect = require('../middleware/protect')
const {
  createLeague, getMyLeagues, getLeague,
  updateLeague, deleteLeague, joinLeague, leaveLeague
} = require('../controllers/leagueController')
const matchRoutes = require('./matchRoutes')

router.use(protect)

router.post('/',            createLeague)
router.get('/',             getMyLeagues)
router.get('/:id',          getLeague)
router.put('/:id',          updateLeague)
router.delete('/:id',       deleteLeague)
router.post('/:id/join',    joinLeague)
router.delete('/:id/leave', leaveLeague)

// Nest match routes — mergeParams on matchRoutes lets it see :id as :leagueId
router.use('/:id/matches',  matchRoutes)

module.exports = router