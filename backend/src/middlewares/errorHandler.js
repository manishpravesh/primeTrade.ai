const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || "Server error",
  };

  if (err.errors) {
    payload.errors = err.errors;
  }

  res.status(statusCode).json(payload);
};

module.exports = { errorHandler };
