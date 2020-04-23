const { all_languages } =  require('./constants')

exports.get_languages = (lang) => {
  if (lang) {
    return [lang];
  }
  else {
    return all_languages;
  }
}