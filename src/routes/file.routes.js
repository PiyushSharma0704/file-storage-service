const express = require('express');
const upload = require('../middleware/upload');

const router = express.Router();

router.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });
  }
);


module.exports = router;