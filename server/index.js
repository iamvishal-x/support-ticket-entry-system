import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import HttpStatus from "http-status";
import ApiError from "./utils/ApiError.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";
import routes from "./routes/index.routes.js";
import "dotenv/config.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(HttpStatus.OK).send("Welcome to Support Ticket Entry System");
});

app.use("/api", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new ApiError(HttpStatus.NOT_FOUND, "Api not found");
  return next(err);
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const mongoUrl = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(mongoUrl)
  .then(() => console.log(`Successfully connected to ${mongoUrl}`))
  .catch((err) =>
    console.error(`Connection to "${mongoUrl}" failed because ${err.message}`)
  );

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
