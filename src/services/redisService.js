const redis = require('redis');

// Initialize Redis Client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => console.log('Redis connected'))
  .catch((err) => console.error('Redis connection error:', err));

// Add a task to the Redis queue
const addTaskToQueue = async (queueName, task) => {
  try {
    await redisClient.rPush(queueName, JSON.stringify(task));
    console.log(`Task added to queue: ${queueName}`);
  } catch (error) {
    console.error('Error adding task to queue:', error);
  }
};

// Fetch a task from the Redis queue
const getTaskFromQueue = async (queueName) => {
  try {
    const task = await redisClient.lPop(queueName);
    return task ? JSON.parse(task) : null;
  } catch (error) {
    console.error('Error fetching task from queue:', error);
    return null;
  }
};

module.exports = {
  redisClient,
  addTaskToQueue,
  getTaskFromQueue,
};
