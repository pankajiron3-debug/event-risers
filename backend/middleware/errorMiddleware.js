// Custom Async Handler wrapper to eliminate boilerplate try-catch blocks
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 Not Found Middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - [${req.method}] ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Resource not found with invalid identifier: ${err.value}`;
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join(', ');
  }

  // Handle Mongo Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate field value entered for ${field}. Please use another value.`;
  }

  // Handle SMTP/Nodemailer specific errors gracefully
  if (err.code === 'EAUTH' || err.code === 'ESOCKET' || err.code === 'EENVELOPE') {
    statusCode = 502;
    message = `SMTP Transmission Error: ${err.message || 'Unable to connect to email server'}`;
  }

  console.error(`[Error Log] ${req.method} ${req.url} -> [${statusCode}] ${message}`);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
