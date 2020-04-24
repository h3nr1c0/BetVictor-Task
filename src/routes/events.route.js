const express = require('express')
const router = express.Router()
const { get_languages } = require('../utils')
const { getEventsBySportID } = require('../models/sports.model')

router

  // GET events
  .get('/', async (req, res) => {
    
    const sportId = req.query.sportId
    console.log(`GET events by sportID: ${sportId}`)
    getEventsBySportID(sportId)
    .then(events => {
      console.log(`length: ${events.length}`);
      res.status(200).json(events)
    })
    .catch(err => {
      res.status(400).json(err)
    })
  })

module.exports = router
