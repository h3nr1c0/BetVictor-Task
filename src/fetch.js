const fetch = require('node-fetch');
const { get_data_url } =  require('./constants')

exports.fetch_BVdata = async (lang) => {
    const page_no = 1
    const url = get_data_url(page_no, lang)
    console.info('fetching: ', url);
    
    return fetch(url)
    .then(response => response.json()
    ).then(response => {
      return get_results(response)
    })
}

const get_results = (response) => {
  if (response) return response.result
}
