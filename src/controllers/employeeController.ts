import mongoose from "mongoose";
import { AppError, BadRequestError } from "../errors/AppError.js";
import type { EmployeeDocument } from "../models/employeeModel.js";
import { Workplace } from "../models/workplaceModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

export const leaveCurrentWorkplace = catchAsyncError<EmployeeDocument>(async (req, res, next) => {
  if (!req.user.workplace) return next(new BadRequestError("You are not a part of any workplace"));

  const workplace = await Workplace.findById(req.user.workplace._id);
  if (workplace?._id.toString() !== req.user.workplace._id.toString())
    return next(
      new BadRequestError("You are not a part of the workplace you've requested to leave"),
    );

  if (!workplace || workplace?._id.toString() === req.user.workplace._id.toString())
    req.user.workplace = null;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedUser = await req.user.save({ session });
    await workplace.updateOne({ $inc: { numEmployees: -1 } });
    await session.commitTransaction();
    return res.status(200).json({
      status: "success",
      message: "You have successfully left the workplace",
      user: updatedUser.toObject(),
    });
  } catch {
    await session.abortTransaction();
    return next(
      new AppError("We encountered a problem while trying to offboard you from the workplace", 500),
    );
  } finally {
    session.endSession();
  }
});
