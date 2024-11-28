const app = require('../app'); // Import the configured Express app
const dotenv = require('dotenv');
const http = require('http');

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
    process.exit(1);
  } else {
    console.error('Unexpected server error:', err);
    process.exit(1);
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Gracefully handle shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down.');
    process.exit(0);
  });
});
