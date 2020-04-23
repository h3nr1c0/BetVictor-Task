const express = require('express')
const router = express.Router()
const { fetch_BVdata } = require('../fetch')
const { get_languages } = require('../utils')

router
  // GET
  .get('/', async (req, res) => {
    const languages = get_languages(req.query.lang);
    // Promise.all(
    //   languages.map(lang => {
    //     return fetch_BVdata(lang)
    //   }))
    //   .then(results => {
    const results = req.app.locals.fetched_data
    const sports = []
    res.status(200).json(results)
    // if (results !== undefined) {
    //   results.map(result => {
    //     result.sports.map(sport => {
    //       sports.push({ id: sport.id, desc: sport.desc, pos: sport.pos })
    //     })
    //   })
    //   const sorted = sports.sort((a, b) => a.pos - b.pos)
    //   console.log(`length: ${sports.length}`);
    //   res.status(200).json(sorted)
    // } else {
    //   res.status(200).json('fetching ...')
    // }
    // })
  })

  // GET test
  .get('/test', async (req, res) => {
    Promise.all([fetch_BVdata(all_languages[0])])
      .then(results => {
        res.status(200).json(results)
      })
  })

module.exports = router
