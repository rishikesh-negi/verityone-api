export class AppError extends Error {
  public statusCode: number;
  public status: "fail" | "error";
  public readonly isOperational: true;

  constructor(message: string, statusCode: number = 500) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedAccessError extends AppError {
  constructor(message = "Unauthorized Access") {
    super(message, 401);
  }
}

export class ForbiddebAccessError extends AppError {
  constructor(message = "Forbidden: Authorization Failed") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
  }
}
