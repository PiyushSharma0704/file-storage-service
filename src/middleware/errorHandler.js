const multer = require("multer");

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File size exceeded",
          err: err,
        });

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Unexpected field",
          err: err,
        });

      default:
        return res.status(400).json({
          success: false,
          message: err.message,
          err: err,
        });
    }
  }

  if (err instanceof Error) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
      err: err,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    err: err,
  });
}

module.exports = errorHandler;
