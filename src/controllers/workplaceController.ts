import mongoose from "mongoose";
import {
  AppError,
  NotFoundError,
  UnauthorizedAccessError,
  UnprocessableContentError,
} from "../errors/AppError.js";
import { Employee } from "../models/employeeModel.js";
import { type WorkplaceDocument } from "../models/workplaceModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

export const getAllEmployees = catchAsyncError(async (req, res, next) => {
  const employees = await Employee.find({ workplace: (req.user as WorkplaceDocument)._id });
  if (!employees)
    return next(
      new AppError(
        "Encountered a problem while trying to find the employees of your workplace",
        500,
      ),
    );

  res.status(200).json({
    status: "success",
    employees,
  });
});

export const offboardEmployee = catchAsyncError(async (req, res, next) => {
  const { employeeId } = req.params as { [K: string]: string };
  if (!employeeId) return next(new UnprocessableContentError());

  const employee = await Employee.findById(employeeId);
  if (!employee) return next(new NotFoundError("Employee not found"));

  if ((req.user as WorkplaceDocument)._id.toString() !== employee.workplace?._id.toString())
    return next(new UnauthorizedAccessError("Employee is not onboarded at your workplace"));

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await employee.updateOne({ workplace: null }, { session });
    await (req.user as WorkplaceDocument).updateOne({ $inc: { numEmployees: -1 } }, { session });
  } catch {
    await session.abortTransaction();
    return next(new AppError("We encountered a problem while offboarding the employee", 500));
  } finally {
    session.endSession();
  }
});
