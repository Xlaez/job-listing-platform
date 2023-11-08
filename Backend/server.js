const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors({ "origin": "*" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const auth = require("./routes/auth");
const job = require("./routes/job");

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "job-listing-server",
    status: "Active",
    time: new Date(),
  });
});

//routes
app.use(auth);
app.use(job);

//error handler middleware
app.use((req, res, next) => {
  const err = new Error("page not found");
  err.status = 404;
  next(err);
});

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

//server listening
app.listen(process.env.PORT, (error) => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      console.log(`server is running on http://localhost:${process.env.PORT}`)
    )
    .catch((err) => console.log(err));
});
