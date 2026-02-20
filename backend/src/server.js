const mongoose = require("mongoose");
const app = require("./app");
const { connectToDatabase } = require("./config/db");

const PORT = process.env.PORT || 4000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    mongoose.connection.close();
    process.exit(1);
  });
