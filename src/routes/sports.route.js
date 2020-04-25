const express = require('express')
const router = express.Router()
const { getSportsByLanguage } = require('../models/model')

router
  // GET sports
  .get('/', async (req, res) => {
    getSportsByLanguage(req.query.lang)
    .then(sports => {
      res.status(200).json(sports)
    })
    .catch(err => {
      res.status(400).json(err)
    })
  })

module.exports = router
