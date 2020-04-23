require('dotenv').config()

exports.all_languages = process.env.LANGUAGES.split(',');

exports.get_data_url = (pageNo, language) => {
  return `https://partners.betvictor.mobi/${language}/in-play/${pageNo}/events`;
}