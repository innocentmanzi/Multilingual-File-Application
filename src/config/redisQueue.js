const Queue = require('bull'); // Ensure Bull is installed: `npm install bull`
const redis = require('./redis'); // Reuse the Redis connection

// Initialize Redis-based queue
const fileQueue = new Queue('file-upload', {
  redis: { host: '127.0.0.1', port: 6379 },
});

// Queue event listeners (optional)
fileQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

fileQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

module.exports = fileQueue;
