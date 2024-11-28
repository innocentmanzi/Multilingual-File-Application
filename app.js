require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const i18n = require('i18n');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./src/config/swagger'); // Swagger configuration
const connectDB = require('./src/config/db'); // Database connection
const redisClient = require('./src/config/redis'); // Redis connection
const userRoutes = require('./src/routes/userRoutes'); // User routes
const fileRoutes = require('./src/routes/fileRoutes'); // File routes
const { notFound, errorHandler } = require('./src/utils/errorHandler'); // Error handlers

const app = express();

// Connect to the database
connectDB();

// Enable CORS with options
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Adjust this for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Include cookies if necessary
}));

// Middleware to parse JSON
app.use(express.json());

// Setup i18n for localization (language support)
i18n.configure({
  locales: ['en', 'es', 'fr'], // Add more languages as needed
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  queryParameter: 'lang',
  cookie: 'lang',
});
app.use(i18n.init);

// Swagger UI setup for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

// Example route with i18n translation
app.get('/', (req, res) => {
  res.send(res.__('welcome')); // Use i18n translation for 'welcome'
});

// Error handling middleware
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // General error handler

console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('REDIS_PORT:', process.env.REDIS_PORT);
console.log('REDIS_URL:', process.env.REDIS_URL);


// Export the app instance for use in index.js
module.exports = app;
