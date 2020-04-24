const { all_languages } =  require('./constants')

// array of language or all languages
exports.get_languages = (lang) => {
  if (lang) {
    return [lang];
  }
  else {
    return all_languages;
  }
}