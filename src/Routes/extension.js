const express = require('express')
const router = express.Router()
const DB = require('../Models')

/**
 * This route is used by the extension.
 * */

/**
 * Method used when the user is running the extension
 * and it sends data to the database.
 * Find the user and sets the session with foreign key to the user.
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

router.post('/user', async (req, res) => {
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

  res.json(user)
})

/**
 * Get user settings by email.
* */
router.get('/settings', async(req, res) => {
  const { email } = req.body.user
  let user = await DB.User.findOne({
    attributes: ['settings'],
    where: { email: email }
  })
  res.json(user)
})

/**
 *  Get user settings by user id.
 *  */
router.get('/settings/:id', async (req, res) => {
  let user = await DB.User.findOne({
    attributes: ['settings'],
    where: { id: req.params.id }
  })

  res.json(user)
})

module.exports = router
