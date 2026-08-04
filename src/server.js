const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

async function startServer() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

startServer();