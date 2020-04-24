const express = require('express')
const router = express.Router()
const { getEventsBySportID, getEventByID } = require('../models/sports.model')

router

  // GET events bz SportId or all if not defined
  .get('/', async (req, res) => {
    const sportId = req.query.sportId
    console.log(`GET events by sportID: ${sportId}`)
    // return all events if sportId is undefined
    getEventsBySportID(sportId, true)
    .then(events => {
      res.status(200).json(events)
    })
    .catch(err => {
      res.status(400).json(err)
    })
  })
  // GET event by id
  .get('/', async (req, res) => {
    const eventId = req.query.eventId
    console.log(`GET event by id: ${eventId}`)
    // return all events if sportId is undefined
    getEventByID(eventId)
    .then(event => {
      res.status(200).json(event)
    })
    .catch(err => {
      res.status(400).json(err)
    })
  })

module.exports = router
