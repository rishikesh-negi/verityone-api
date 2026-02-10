import { MongoServerError } from "mongodb";
import { AppError, BadRequestError, NotFoundError } from "./AppError.js";
import mongoose from "mongoose";

export const transformError = (err: unknown) => {
  if (err instanceof mongoose.Error.CastError) {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new BadRequestError(message);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((er: Error) => er.message);
    return new BadRequestError(`Invalid input data. ${messages.join(", ")}`);
  }

  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    const message = `No document matching the query found`;
    return new NotFoundError(message);
  }

  if (err instanceof MongoServerError) {
    if (err.code === 11000) {
      const field = Object.keys(err["keyValue"])[0];
      const value = err["keyValue"][field!];
      const message = `The value ${value} already exists in the ${field} field. Unique value expteced.`;
      return new AppError(message, 409);
    }
  }
};
