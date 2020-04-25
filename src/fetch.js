/* 
* Test BetVictor
* Fetch BV data
*/
'use strict'

const fetch = require('node-fetch')
const { get_data_url } = require('./constants')
const { logger } = require('./logger')

exports.fetch_BVdata = async (lang) => {
  const page_no = 1 // for future use
  const url = get_data_url(page_no, lang)
  logger.info(`fetching: ${url}`);

  return fetch(url)
    .then(response => response.json()
    ).then(response => {
      return get_results(response)
    })
}

const get_results = (response) => {
  if (response) return response.result
}
