const express = require('express')
const router = express.Router()
const { getEventsBySportID, getEventByID } = require('../models/model')

router
  // List all events of SportId or all sports if not defined
  .get('/', async (req, res) => {
    const sportId = req.query.sportId
    // return all events if sportId is undefined
    getEventsBySportID(sportId, true)
      .then(events => {
        res.status(200).json(events)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  })

  // List all outcomes for a given sport event by IDs
  .get('/:sportId/events/:eventId', async (req, res) => {
    var sportId = Number(req.params.sportId)
    var eventId = Number(req.params.eventId)
    getEventByID(sportId, eventId)
      .then(event => {
        res.status(200).json(event)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  })

module.exports = router
