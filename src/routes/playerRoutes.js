const express = require('express')
const router = express.Router()
const protect = require('../middleware/protect')
const { searchPlayers, getPlayer, getPlayersBySport } = require('../controllers/playerController')

router.use(protect)

router.get('/search',       searchPlayers)
router.get('/sport/:sport', getPlayersBySport)
router.get('/:id',          getPlayer)

module.exports = router