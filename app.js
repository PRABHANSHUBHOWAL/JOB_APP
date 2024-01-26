require("dotenv").config();
require("express-async-errors");
const path = require("path");
const express = require("express");
const app = express();
// connect db
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// Routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// middleware
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());
// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
// extra packages

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Database connected");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
