const AppError = (res, message, statusCode = 500) => {
 return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

module.exports = AppError;