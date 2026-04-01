const League = require('../models/League')

/**
 * Middleware: ensures the authenticated user is the admin/creator of the league.
 * Works with mergeParams:true — reads :id from the parent leagueRoutes param.
 */
const requireLeagueAdmin = async (req, res, next) => {
  try {
    // mergeParams gives us :id from /:id/matches in leagueRoutes
    const leagueId = req.params.id

    const league = await League.findById(leagueId)
    if (!league) {
      return res.status(404).json({ message: 'League not found' })
    }

    const creatorId = league.commissioner?.toString()
    const userId    = req.user._id?.toString() || req.user.id?.toString()

    if (creatorId !== userId) {
      return res.status(403).json({ message: 'Only the league admin can perform this action' })
    }

    req.league = league
    next()
  } catch (err) {
    res.status(500).json({ message: 'Server error in admin check' })
  }
}

module.exports = requireLeagueAdmin