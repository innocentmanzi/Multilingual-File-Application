// Middleware for handling 404 errors
const notFound = (req, res, next) => {
  const error = new Error(`The requested resource ${req.originalUrl} was not found`);
  res.status(404);
  next(error);
};

// General error-handling middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500; // Default to 500 if no status code
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack, // Hide stack trace in production
  });
};

module.exports = { notFound, errorHandler };
