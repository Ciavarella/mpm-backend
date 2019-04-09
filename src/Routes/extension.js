const express = require('express')
const router = express.Router()
const DB = require('../Models')

/**
 * This route is used by the extension.
 * */


/**
 * Method used when the user is running the extension
 * and it sends data to the database.
 *
 * Find the user and sets the session with foreign key to the user.
 *
 * Creates the user if there is no user found.
 * */
router.post('/', async (req, res) => {
  const { totalTime, pausedTimes, sessionId, musicTime } = req.body
  const { email, display_name, id } = req.body.user
  let user = await DB.User.findOne({ where: { email: email } })

  if (!user) {
    user = await DB.User.create({
      username: display_name,
      email: email,
      spotifyId: id,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  let session = await DB.Session.upsert(
    {
      id: sessionId,
      totalTime: totalTime,
      pausedTimes: pausedTimes,
      musicTime: musicTime,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      returning: true
    }
  )

  res.json({ user, session })
})

/**
 * Get all sessions by user id.
 * */
router.get('/:id', async (req, res) => {
  let sessions = await DB.Session.findAll({
    where: { userId: req.params.id },
    order: [['createdAt', 'DESC']]
  })
  res.json(sessions)
})

/**
 * Get all sessions total time by user id.
 * */
router.get('/total/:id', async (req, res) => {
  let totalSessions = await DB.Session.findOne({
    attributes: [
      [
        DB.Sequelize.fn('sum', DB.Sequelize.col('pausedTimes')),
        'pausedTimesSum'
      ],
      [DB.Sequelize.fn('sum', DB.Sequelize.col('musicTime')), 'musicTimeSum'],
      [DB.Sequelize.fn('sum', DB.Sequelize.col('totalTime')), 'totalTimeSum']
    ],
    where: { userId: req.params.id }
  })
  res.json(totalSessions)
})

/**
 * Insert settings to user.
 * */
router.post('/settings/:id', async (req, res) => {
  let settings = req.body

  let user = await DB.User.update(
    {
      settings: settings
    },
    {
      where: { id: req.params.id },
      returning: true
    }
  )

  res.json(user)
})

/**
 *  Get user settings by user id.
 *  */
router.get('/settings/:id', async (req, res) => {
  let user = await DB.User.findOne({
  attributes: ['settings'],
  where: {id: req.params.id}
 })

 res.json(user)
})

module.exports = router
