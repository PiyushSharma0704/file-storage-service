const express = require("express");
const upload = require("../middleware/upload");
const fileController = require("../controllers/file.controller");

const router = express.Router();

router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/", fileController.listFiles);
router.get("/:id/download", fileController.downloadFile);
router.get("/:id/stream", fileController.streamFile);
router.get("/:id", fileController.getFile);
router.delete("/:id", fileController.removeFile);

module.exports = router;
