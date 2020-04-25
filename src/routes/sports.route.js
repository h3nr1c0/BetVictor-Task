const express = require('express')
const router = express.Router()
const { get_languages } = require('../utils')
const { getSportsByLanguage, getEventsBySportID } = require('../models/sports.model')

router
  // GET sports
  .get('/', async (req, res) => {
    const languages = get_languages(req.query.lang, true);
    // console.log(`GET sporst by languages: ${languages}`)
    getSportsByLanguage(req.query.lang)
    .then(sports => {
      res.status(200).json(sports)
    })
    .catch(err => {
      res.status(400).json(err)
    })
  })

module.exports = router
