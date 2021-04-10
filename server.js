const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require('cookie-parser')
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

dotenv.config({ path: "./config/config.env" });

connectDB();

//ROUTES
const bootcamp = require("./routes/bootcamp");
const courses = require("./routes/courses");
const auth = require("./routes/auth")

const app = express();

app.use(express.json());
app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
