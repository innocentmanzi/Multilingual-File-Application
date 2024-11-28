const Redis = require('ioredis');
const Queue = require('bull');

// Initialize Redis connection
const redis = new Redis('redis://127.0.0.1:6379');

// Test Redis connection
redis.ping()
  .then((result) => {
    console.log('Redis connection test successful:', result); // Should print 'PONG'
  })
  .catch((err) => {
    console.error('Redis connection test failed:', err.message);
    process.exit(1); // Exit process if Redis is not reachable
  });

// Function to create a Bull queue
function createQueue(queueName) {
  return new Queue(queueName, {
    redis: {
      host: '127.0.0.1', // Replace with your Redis host
      port: 6379,        // Replace with your Redis port
    },
  });
}

module.exports = { redis, createQueue };
