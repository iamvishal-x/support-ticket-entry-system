const ApiError = require("../utils/ApiError.js");
const HttpStatus = require("http-status");
const validate = require("express-validation");

/**
 * Converts validation errors or any other type of error into ApiError format and pass them on to next middleware
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {ApiError} ApiError
 */
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (error instanceof validate.ValidationError) {
    error = constructValidationError(error);
  } else if (!(error instanceof ApiError)) {
    error = constructOtherError(error);
  }
  next(error);
};

/**
 * Handles API errors and sends an appropriate response
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const errorHandler = (err, req, res, next) => {
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

module.exports = { errorConverter, errorHandler };
