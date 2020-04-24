const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const sports_route = require('./routes/sports.route')
const events_route = require('./routes/events.route')

require('dotenv').config()
const PORT = process.env.SERVER_PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(logger('dev'))

app.use('/sports', sports_route)
app.use('/events', events_route)

// START THE SERVER
const server = app.listen(PORT, () => {
  console.info(`server running on: http://localhost:${PORT}`)

})
/// HANDLE SERVER CLOSING
server.on('close', () => {
  console.warn('Closing server ...')
})

/// HANDLE SERVER CLOSING
process.on('exit', () => {
  client.close()
    .then(
      console.warn('Server closed')
    )
})

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    })
  })
}

// root
app.get('', (req, res) => res.status(403).send('Root endpoint not implemented'))

// unknown routes
app.get('**', (req, res) => res.status(404).send('Not Found'))
