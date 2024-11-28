const i18n = require('../utils/i18nConfig'); // Import i18n configuration

const setLanguage = (req, res, next) => {
  const lang = req.query.lang || req.headers['accept-language']; // Check query parameter first, fallback to header
  if (lang && i18n.getLocales().includes(lang)) {
    i18n.setLocale(lang); // Set language if valid
  } else {
    i18n.setLocale(i18n.getLocale()); // Use default locale
  }
  next();
};

module.exports = { setLanguage };
