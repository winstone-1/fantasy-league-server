const express = require('express')
const router = express.Router()
const protect = require('../middleware/protect')
const {
  createLeague, getMyLeagues, getLeague,
  updateLeague, deleteLeague, joinLeague, leaveLeague
} = require('../controllers/leagueController')

router.use(protect) // all league routes require login

router.post('/',          createLeague)
router.get('/',           getMyLeagues)
router.get('/:id',        getLeague)
router.put('/:id',        updateLeague)
router.delete('/:id',     deleteLeague)
router.post('/:id/join',  joinLeague)
router.delete('/:id/leave', leaveLeague)

module.exports = router