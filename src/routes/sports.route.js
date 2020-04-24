const express = require('express')
const router = express.Router()
const { fetch_BVdata } = require('../fetch')
const { get_languages } = require('../utils')
// const { mcache } = require('../mcache')
const { getSportsByLanguage } = require('../models/sports.model')

router
  // GET

  // .get('/', mcache(), async (req, res) => {
  .get('/', async (req, res) => {
    const languages = get_languages(req.query.lang);
    console.log(`GET sporst by languages: ${languages}`)
    getSportsByLanguage(req.query.lang)
    .then(sports => {
      console.log(`length: ${sports.length}`);
      res.status(200).json(sports)
    })
    .catch(err => {
      res.status(400).json(err)
    })
  })

  // GET test
  .get('/test', async (req, res) => {
    Promise.all([fetch_BVdata(all_languages[0])])
      .then(results => {
        res.status(200).json(results)
      })
  })

module.exports = router
