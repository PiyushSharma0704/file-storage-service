const File = require("../models/file.model");

async function createFile(data) {
  return File.create(data);
}

async function getFiles() {
  return File.find({ isDeleted: false })
    .sort({ createdAt: -1 });
}

async function getFileById(id) {
  return File.findOne({ _id: id, isDeleted: false });
}

async function deleteFile(id) {
  return File.findOneAndUpdate(
    { _id: id, isDeleted: false },
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
