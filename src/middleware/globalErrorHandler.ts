import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { transformError } from "../errors/transformError.js";
import { GENERIC_ERROR_MSG } from "../utils/constants.js";

export type SendErrorFunction = (
  err: Error | AppError,
  req: Request,
  res: Response,
) => void;

function generateErrorResponse(
  err: Error | AppError,
  res: Response,
  message: string = GENERIC_ERROR_MSG,
) {
  const status = err instanceof AppError ? err.status : "error";
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  return res.status(statusCode).json({
    status,
    message: message,
  });
}

// -----> Function to send a detailed error response in development for debugging:
const sendErrorInDevelopment: SendErrorFunction = function (err, req, res) {
  // Sending a detailed error in response to an invalid/failed API request:
  if (req.originalUrl.startsWith("/api")) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const status = err instanceof AppError ? err.status : "error";

    return res.status(statusCode).json({
      status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Sending an error response for non-API errors:
  return generateErrorResponse(err, res, err.message);
};

// -----> Function to send an error response in production:
const sendErrorInProduction: SendErrorFunction = function (err, req, res) {
  // Sending an error response for invalid/failed API requests:
  if (req.originalUrl.startsWith("/api")) {
    // Operational error - Send message to the client:
    if (err instanceof AppError)
      return generateErrorResponse(err, res, err.message);

    // Programming or unknown error - Log it to the console and send a generic error message to the client:
    console.error("ERROR: ", err);
    return generateErrorResponse(err, res, GENERIC_ERROR_MSG);
  }

  // Non-API error:
  if (err instanceof AppError)
    return generateErrorResponse(err, res, err.message);

  return generateErrorResponse(err, res, GENERIC_ERROR_MSG);
};

export function globalErrorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env["NODE_ENV"] === "development") {
    sendErrorInDevelopment(err, req, res);
  }

  if (process.env["NODE_ENV"] === "production") {
    const error = transformError(err);
    sendErrorInProduction(error, req, res);
  }
}
