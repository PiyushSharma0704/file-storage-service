const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

const path = require("path");

router.post("/upload", upload.single("file"), (req, res) => {
  const folder = req.file.mimetype.startsWith("image/")
    ? "images"
    : "documents";

  const fileUrl =
    `${req.protocol}://${req.get("host")}` +
    `/uploads/${folder}/${req.file.filename}`;

  res.status(201).json({
    success: true,
    url: fileUrl,
    file: req.file,
  });
});

// router.post("/upload", upload.single("file"), (req, res) => {
//   res.status(201).json({
//     success: true,
//     message: "File uploaded successfully",
//     file: {
//       filename: req.file.filename,
//       originalName: req.file.originalname,
//       mimeType: req.file.mimetype,
//       size: req.file.size,
//       path: req.file.path,
//     },
//   });
// });

router.post("/upload-multiple", upload.array("files", 3), (req, res) => {
  const files = req.files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    path: file.path,
  }));
  res.status(201).json({
    success: true,
    message: "Files uploaded successfully",
    files,
  });
});

router.post(
  "/upload-profile",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    res.status(201).json({
      success: true,
      avatar: req.files.avatar?.[0] || null,
      resume: req.files.resume?.[0] || null,
    });
  },
);

module.exports = router;
