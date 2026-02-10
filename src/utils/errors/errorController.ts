import type { NextFunction, Request, Response } from "express";
import type { AppError } from "./AppError.js";

export type SendErrorFunction = (
  err: Error | AppError,
  req: Request,
  res: Response,
) => void;

function generateErrorResponse(
  err: Error | AppError,
  res: Response,
  message: string,
) {
  const status = "statusCode" in err ? err.status : "error";
  const statusCode = "statusCode" in err ? err.statusCode : 500;

  return res.status(statusCode).json({
    status,
    message: message,
  });
}

// -----> Function to send a detailed error response in development for debugging:
const sendErrorInDevelopment: SendErrorFunction = function (err, req, res) {
  // Sending an error response for invalid/failed API requests:
  if (req.originalUrl.startsWith("/api")) {
    const statusCode = "statusCode" in err ? err.statusCode : 500;
    const status = "statusCode" in err ? err.status : "error";

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
    if ("isOperational" in err)
      return generateErrorResponse(err, res, err.message);

    // Programming/unknown error - Log it to the console and send a generic error message to the client:
    console.error("ERROR: ", err);
    return generateErrorResponse(err, res, "Someting went wrong!");
  }

  // Non-API error:
  if ("isOperational" in err)
    return generateErrorResponse(err, res, err.message);

  return generateErrorResponse(err, res, "Someting went wrong!");
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
    const error = { ...err };
  }
}
