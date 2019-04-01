const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
const verifyToken = require('../Middleware/TokenVerify')

router.get('/me', verifyToken, async (req, res) => {
  res.json(req.user)
})

module.exports = router
