const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    type: err.errorType || 'UNKNOWN',
    statusCode: err.statusCode || 500,
    stack: err.stack
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // MongoDB Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  // JWT Invalid Token
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  // JWT Expired Token
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors[0] || 'Validation failed';
  }

  // Generic server errors in production should not expose details
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
