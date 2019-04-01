require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const auth = require('./Routes/auth')
const extension = require('./Routes/extension')
const dashboard = require('./Routes/dashboard')
const UserController = require('./Controllers/UserController')
const port = process.env.PORT || 8080
require('./Models/index')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/auth', auth)
app.use('/dashboard', dashboard)
app.use('/user', UserController)
app.use('/extension', extension)
app.listen(port, () => console.log(`Express listening to port: ${port}`))

module.exports = app
