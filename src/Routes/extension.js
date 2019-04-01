const express = require('express')
const router = express.Router()
const DB = require('../Models')

router.post('/', async (req, res) => {
  const { totalTime, pausedTimes, sessionId } = req.body
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

router.get('/:id', async (req, res) => {
  let sessions = await DB.Session.findAll({
    where: { userId: req.params.id },
    order: [['createdAt', 'DESC']]
  })
  res.json(sessions)
})

module.exports = router
