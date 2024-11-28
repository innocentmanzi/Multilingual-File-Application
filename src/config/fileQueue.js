const Queue = require('bull');
const { uploadFile } = require('../services/fileServices');

const fileQueue = new Queue('file-processing', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

// Process file upload tasks from the queue
fileQueue.process('file-upload', async (job) => {
  const { userId, file } = job.data;

  try {
    console.log(`Processing file upload for user: ${userId}`);
    await uploadFile(userId, file);
    console.log(`File upload completed for user: ${userId}`);
  } catch (error) {
    console.error(`Error processing file upload for user: ${userId}`, error);
    throw error;
  }
});

fileQueue.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

fileQueue.on('failed', (job, error) => {
  console.error(`Job failed: ${job.id}, Error: ${error.message}`);
});

module.exports = { fileQueue };
