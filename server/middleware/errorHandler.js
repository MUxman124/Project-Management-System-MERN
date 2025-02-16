
import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {

  console.log("in the error handler")
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    body: req.body,
  });

  logger.error(err , "sdsdsdsdsdsd");

  const statusCode = err.statusCode || 500;
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Validation error",
      errors,
    });
  } 


  const errorResponse = {
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(errorResponse);
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { errorHandler, AppError };