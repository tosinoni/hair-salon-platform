const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const helmet = require('helmet')
const userRoutes = require('./routes/users.js')
const accountRoutes = require('./routes/account.js')
const userController = require('./controllers/users.js')
const path = require('path')
const serveStatic = require('serve-static')
const emailService = require('./email-service/email-service.js')
const schedule = require('node-schedule')
const CronJob = require('cron').CronJob

dotenv.config()

const API_PORT = process.env.PORT || 3000
const app = express()

const dbRoute = process.env.DB_LINK

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true },
)

let db = mongoose.connection

db.once('open', () => console.log('connected to the database'))

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(helmet())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/api', (req, res) => {
  res.json({ success: true, message: 'API root.' })
})

app.use('/api/users', userRoutes)
app.use('/api/account', accountRoutes)

const appDir = path.join(`${__dirname}/../dist/index.html`)
app.use(serveStatic('./dist', { index: ['default.html', 'default.htm'] }))

app.get('*', function(req, res) {
  res.sendFile(appDir)
})
// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))

userController.createAdmin()

const job = new CronJob('0 7 * * *', function() {
  console.log('sending email...')
  emailService.sendDailyEmail()
})
job.start()
