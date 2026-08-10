const File = require("../models/file.model");

async function createFile(data) {
  return File.create(data);
}

async function getFiles() {
  return File.find({ isDeleted: false })
    .sort({ createdAt: -1 });
}

async function getFileById(id) {
  return File.findById(id);
}

async function deleteFile(id) {
  return File.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );
}

module.exports = {
  createFile,
  getFiles,
  getFileById,
  deleteFile,
};