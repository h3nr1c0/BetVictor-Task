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

exports.getSportsByLanguage = async (language) => {
  const languages = get_languages(language)
  return Promise.all(
    languages.map(lang => {
      // node-cache
      return cache.get(lang, () => {
        return fetch_BVdata(lang)
      })
      // memory cache
      // return fetch_BVdata(lang)
    })
  )
    .then(results => {
      const sports = []
      results.map(result => {
        result.sports.map(sport => {
          sports.push(sport)
        })
      })
      const sorted = sports.sort((a, b) => a.pos - b.pos)
      return sorted
    })
}
