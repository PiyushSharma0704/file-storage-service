const fs = require("fs");
const fsp = require("fs/promises");
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
    await fsp.unlink(req.file.path).catch(() => {});
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
    await fsp.access(localPath);
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
  await fsp.unlink(localPath).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  await fileService.deleteFile(req.params.id);

  res.json({ success: true, message: "File deleted successfully" });
}

function parseRange(rangeHeader, size) {
  if (!rangeHeader) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
  if (!match) return undefined;

  const [, startValue, endValue] = match;
  if (!startValue && !endValue) return undefined;

  let start;
  let end;
  if (!startValue) {
    const suffixLength = Number(endValue);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return undefined;
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  } else {
    start = Number(startValue);
    end = endValue ? Number(endValue) : size - 1;
  }

  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    start >= size ||
    end < start
  ) {
    return undefined;
  }

  return { start, end: Math.min(end, size - 1) };
}

async function streamFile(req, res, next) {
  validateId(req.params.id);
  const file = await fileService.getFileById(req.params.id);

  if (!file) {
    const error = new Error("File not found");
    error.statusCode = 404;
    throw error;
  }

  const localPath = getLocalPath(file);
  let stats;
  try {
    stats = await fsp.stat(localPath);
  } catch {
    const error = new Error("File contents not found");
    error.statusCode = 404;
    throw error;
  }

  if (!stats.isFile()) {
    const error = new Error("File contents not found");
    error.statusCode = 404;
    throw error;
  }

  const range = parseRange(req.headers.range, stats.size);
  if (range === undefined) {
    return res.status(416).set("Content-Range", `bytes */${stats.size}`).end();
  }

  const start = range?.start;
  const end = range?.end;
  const contentLength = range ? end - start + 1 : stats.size;
  const statusCode = range ? 206 : 200;

  res.writeHead(statusCode, {
    "Accept-Ranges": "bytes",
    "Content-Type": file.mimeType,
    "Content-Length": contentLength,
    ...(range && { "Content-Range": `bytes ${start}-${end}/${stats.size}` }),
  });

  const readStream = range
    ? fs.createReadStream(localPath, { start, end })
    : fs.createReadStream(localPath);
  readStream.on("error", (error) => {
    if (res.headersSent) return res.destroy(error);
    return next(error);
  });
  readStream.pipe(res);
}

module.exports = {
  uploadFile,
  listFiles,
  getFile,
  downloadFile,
  removeFile,
  streamFile,
};
