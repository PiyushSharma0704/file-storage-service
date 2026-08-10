const express = require("express");
const upload = require("../middleware/upload");
const fileController = require("../controllers/file.controller");

const router = express.Router();

router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/", fileController.listFiles);
router.get("/:id", fileController.getFile);
router.get("/:id/download", fileController.downloadFile);
router.delete("/:id", fileController.removeFile);

module.exports = router;
