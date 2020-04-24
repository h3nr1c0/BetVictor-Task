// Sports model with cache

const { fetch_BVdata } = require('../fetch')
const { get_languages } = require('../utils')
const Cache = require('../cache')

require('dotenv').config()
const TTL = Number(process.env.CACHE_TTL)

const cache = new Cache(TTL) // Create a new cache service instance
cache.get_cache().on("expired", function (key, value) {
  console.info(`cache for fetched "${key}" data expired`);
})

exports.getSportsByLanguage = async (language, sort) => {
  const languages = get_languages(language)
  return Promise.all(
    languages.map(lang => {
      return cache.get(lang, () => {
        return fetch_BVdata(lang)
      })
    })
  )
    .then(results => {
      const sports = []
      results.map(result => {
        result.sports.map(sport => {
          sports.push(sport)
        })
      })
      if (sort) {
        return sports.sort((a, b) => a.pos - b.pos)
      } else {
        return sports
      }
    })
}

exports.getEventsBySportID = async (sportID) => {
  return exports.getSportsByLanguage(undefined, false)
    .then(sports => {
      let found
      if (sportID) {
        const compareSportID = Number(sportID)
        found = sports.filter(sport => sport.id === compareSportID)
      } else {
        found = sports
      }
      const events = []
      found.map(sport => {
        if (sport.comp) {
          sport.comp.map(competition => {
            if (competition.events) {
              competition.events.map(event => {
                events.push(event)
              })
            }
          })
        }
      })
      return events.sort((a, b) => a.pos - b.pos)
    })
}