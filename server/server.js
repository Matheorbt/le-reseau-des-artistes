require("dotenv").config({ path: "./config.env" });

const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

//Connect DB
connectDB();

const app = express();

app.use(express.json());

// Define the routes used for the API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/post", require("./routes/post"));
app.use("/api/comment", require("./routes/comment"));

//Error Handler Must be last Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error ${err}`);
  server.close(() => process.exit(1));
});
