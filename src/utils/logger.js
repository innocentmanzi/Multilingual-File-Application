const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/app.log');

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFileSync(logFilePath, logMessage, { encoding: 'utf8' });
  console.log(logMessage); // Also log to the console
};

module.exports = {
  log,
};
