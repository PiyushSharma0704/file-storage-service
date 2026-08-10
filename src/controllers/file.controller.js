const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const fileService = require("../services/file.service");

const uploadsRoot = path.resolve(__dirname, "../uploads");

function getFolder(mimeType) {
  return mimeType.startsWith("image/") ? "images" : "documents";
}

function toFileResponse(file) {
  return {
    id: file._id,
    originalName: file.originalName,
    filename: file.filename,
    mimeType: file.mimeType,
    extension: file.extension,
    size: file.size,
    storage: file.storage,
    folder: file.folder,
    url: file.url,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
}

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid file id");
    error.statusCode = 400;
    throw error;
  }
}

function getLocalPath(file) {
  const resolvedPath = path.resolve(file.path);
  if (!resolvedPath.startsWith(`${uploadsRoot}${path.sep}`)) {
    const error = new Error("Invalid file storage path");
    error.statusCode = 500;
    throw error;
  }
  return resolvedPath;
}

async function uploadFile(req, res) {
  if (!req.file) {
    const error = new Error("A file is required");
    error.statusCode = 400;
    throw error;
  }

  const folder = getFolder(req.file.mimetype);
  const url = `${req.protocol}://${req.get("host")}/uploads/${folder}/${req.file.filename}`;

  try {
    const file = await fileService.createFile({
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      extension: path.extname(req.file.originalname).toLowerCase(),
      size: req.file.size,
      folder,
      path: req.file.path,
      url,
    });

    return res.status(201).json({ success: true, file: toFileResponse(file) });
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    throw error;
  }
}

async function listFiles(req, res) {
  const files = await fileService.getFiles();
  res.json({ success: true, files: files.map(toFileResponse) });
}

async function getFile(req, res) {
  validateId(req.params.id);
  const file = await fileService.getFileById(req.params.id);

  if (!file) {
    const error = new Error("File not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, file: toFileResponse(file) });
}

async function downloadFile(req, res, next) {
  validateId(req.params.id);
  const file = await fileService.getFileById(req.params.id);

  if (!file) {
    const error = new Error("File not found");
    error.statusCode = 404;
    throw error;
  }

  const localPath = getLocalPath(file);
  try {
    await fs.access(localPath);
  } catch {
    const error = new Error("File contents not found");
    error.statusCode = 404;
    throw error;
  }

  return res.download(localPath, file.originalName, (error) => {
    if (error) next(error);
  });
}

async function removeFile(req, res) {
  validateId(req.params.id);
  const file = await fileService.getFileById(req.params.id);

  if (!file) {
    const error = new Error("File not found");
    error.statusCode = 404;
    throw error;
  }

  const localPath = getLocalPath(file);
  await fs.unlink(localPath).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  await fileService.deleteFile(req.params.id);

  res.json({ success: true, message: "File deleted successfully" });
}

module.exports = { uploadFile, listFiles, getFile, downloadFile, removeFile };
