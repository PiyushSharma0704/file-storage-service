const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fileRoutes = require("./routes/file.routes");
const errorHandler = require("./middleware/errorHandler");
const httpLogger = require("./middleware/logger");
const path = require("path");

const app = express();

app.use(cors());
app.use(helmet());
// app.use(morgan("dev"));
app.use(httpLogger);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.get("/health", (req, res) => {
  res.json({ success: 1, message: "API is healthy" });
});

app.use("/files", fileRoutes);

app.use(errorHandler);

module.exports = app;
