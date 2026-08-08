const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fileRoutes = require("./routes/file.routes");


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: 1, message: "API is healthy" });
});

app.use("/files", fileRoutes);

module.exports = app;
