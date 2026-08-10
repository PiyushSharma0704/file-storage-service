const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    filename: {
      type: String,
      required: true,
      unique: true,
    },

    mimeType: {
      type: String,
      required: true,
      index: true,
    },

    extension: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    storage: {
      type: String,
      enum: ["local", "s3", "cloudinary"],
      default: "local",
      index: true,
    },

    folder: {
      type: String,
      enum: ["images", "documents", "others"],
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", fileSchema);