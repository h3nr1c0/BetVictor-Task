const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const { fetch_BVdata } = require('./fetch')
const { get_languages } = require('./utils')
const sports_route = require('./routes/sports')

require('dotenv').config()
const PORT = process.env.SERVER_PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(logger('dev'))

app.use('/sports', sports_route)

// FETCH DATA
const languages = get_languages()
Promise.all(
  languages.map(lang => {
    return fetch_BVdata(lang)
      .then(data => {
        return { language: lang, results: data }
      })
  }))
  .then(results => {
    results_all = []
    results.map(result => {
      results_all.push(result)
    })
    // START THE SERVER
    const server = app.listen(PORT, () => {
      console.info(`server running on: http://localhost:${PORT}`)
      app.locals.fetched_data = results_all

    })
    /// HANDLE SERVER CLOSING
    server.on('close', () => {
      console.warn('Closing server ...')
    })
  })


// START THE SERVER
// const server = app.listen(PORT, () => {
//   const languages = get_languages()
//   Promise.all(
//     languages.map(lang => {
//       return {language: lang, results: fetch_BVdata(lang)}
//     }))
//     .then(results => {
//       console.info(`server running on: http://localhost:${PORT}`)
//       results_all = []
//       results.map(result => {
//         results_all.push(result)
//       })
//       app.locals.fetched_data = results_all
//     })
// })



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
app.get('', (req, res) => res.status(403).send('Not implemented'))

// unknown routes
app.get('**', (req, res) => res.status(404).send('Not Found'))
