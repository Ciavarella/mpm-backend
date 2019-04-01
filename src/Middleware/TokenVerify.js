const jwt = require('jsonwebtoken')
const DB = require('../Models')

function tokenVerify(req, res, next) {
  const tokenHeader = req.headers['authorization']
  const token = tokenHeader.replace('Bearer ', '')

  if (!token) {
    return res.status(401).send({
      authenticated: false,
      message: 'Something went wrong, no token provided.'
    })
  }

  jwt.verify(token, process.env.SECRET, (error, decodedToken) => {
    if (error) {
      res.status(500).send({
        authenticated: false,
        message: 'Something went wrong'
      })
    }

    DB.User.findOne({ where: { email: decodedToken.user.email } }).then(
      user => {
        req.user = user
        next()
      }
    )
  })
}

module.exports = tokenVerify
