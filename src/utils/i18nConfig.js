const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'es', 'fr'], // Add more languages as needed
  directory: __dirname + '/../locales', // Path to the translation files
  defaultLocale: 'en',
  queryParameter: 'lang', // Allow language selection via query parameter, e.g., ?lang=es
  cookie: 'lang', // Store selected language in a cookie for future requests
});

module.exports = i18n;
