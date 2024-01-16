import ApiError from "../utils/ApiError.js";
import HttpStatus from "http-status";
import validate from "express-validation";

export const errorConverter = (err, req, res, next) => {
  let error = err;
  if (error instanceof validate.ValidationError) {
    error = constructValidationError(error);
  } else if (!(error instanceof ApiError)) {
    error = constructOtherError(error);
  }
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message, stack = null } = err;

  const response = {
    success: false,
    code: statusCode,
    message,
    stack,
  };

  res.status(statusCode).send(response);
};

const constructValidationError = (error) => {
  // joi validation error contains errors which is an array of error each containing message[]
  const keyNames = Object.keys(error.details);
  let unifiedErrorMessage = `${error.message}: `;
  keyNames.forEach((name) => {
    unifiedErrorMessage += error.details[name]
      .map((er) => er.message)
      .join(" and ");
  });
  error = new ApiError(error.statusCode, unifiedErrorMessage);
  return error;
};

const constructOtherError = (error) => {
  let statusCode = error.statusCode || HttpStatus.BAD_REQUEST;
  let message = error.message || HttpStatus[statusCode];

  if (error.name === "MongoServerError" && error.code === 11000) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = "Already exists";
  }

  error = new ApiError(statusCode, message, error.stack || "");
  return error;
};
