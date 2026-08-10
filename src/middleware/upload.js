const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const uploadsRoot = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, path.join(uploadsRoot, "images"));
    }

    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("document")
    ) {
      return cb(null, path.join(uploadsRoot, "documents"));
    }

    cb(null, path.join(uploadsRoot, "others"));
  },

  filename(req, file, cb) {
    const extension = path.extname(file.originalname);

    cb(null, `${uuidv4()}${extension}`);
  },
});

module.exports = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }

    cb(null, true);
  },
});
