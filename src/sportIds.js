// show sort ids sorted
const { fetch_BVdata } = require('./fetch')

const lang = 'en-gb'
fetch_BVdata(lang)
  .then(results => {
    const sports = results.sports
    const sportIDs = []
    sports.map(sport => sportIDs.push(sport.epId))
    console.log('sport IDs: ', sportIDs.sort((a, b) => a - b).toString());
  })

