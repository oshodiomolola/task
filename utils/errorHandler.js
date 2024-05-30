class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.result = `${statusCode}`.startsWith("4") ? "FAIL" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next)=> {
  err.statusCode = err.statusCode || 500;
  err.result = err.result || "error";

  res.status(err.statusCode).json({
    result: err.result,
    message: err.message,
  });
}

module.exports = { AppError, errorHandler };
