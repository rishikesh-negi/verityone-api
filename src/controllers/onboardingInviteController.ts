import type { NextFunction, Response } from "express";
import {
  AppError,
  BadRequestError,
  UnauthorizedAccessError,
  UnprocessableContentError,
} from "../errors/AppError.js";
import { Employee, type EmployeeDocument } from "../models/employeeModel.js";
import { OnboardingInvite } from "../models/onboardingInviteModel.js";
import type { RequestWithUser } from "../types/types.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import mongoose from "mongoose";
import { onboardingInviteValidityInSeconds } from "../utils/constants.js";
import { format } from "date-fns";

export const createInvite = catchAsyncError(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { employeeId } = req.params;
    if (!employeeId) return next(new BadRequestError());

    const employee = await Employee.findById(employeeId);
    if (!employee) return next(new UnprocessableContentError());
    if (employee.organization !== null)
      return next(new AppError("Employee is part of another organization", 403));

    const existingInvite = await OnboardingInvite.findOne({
      organization: req.user!.id,
      employee: employeeId,
    }).select("+createdAt");

    if (existingInvite) {
      const inviteExpiryTimestamp =
        existingInvite.createdAt.getTime() + onboardingInviteValidityInSeconds * 1000;
      const inviteExpiryDateString = format(inviteExpiryTimestamp, "MMM dd, yyyy");
      return next(
        new UnprocessableContentError(
          `Cannot invite this employee again until ${inviteExpiryDateString}`,
        ),
      );
    }

    await OnboardingInvite.create({ organization: req.user!.id, employee: employeeId });
    return res.status(201).json({
      status: "success",
      message: "Onboarding invite sent to the employee",
    });
  },
);

export const acceptInvite = catchAsyncError(async (req, res, next) => {
  const { inviteId } = req.params;
  if (!inviteId) return next(new BadRequestError());

  const invite = await OnboardingInvite.findById(inviteId);
  if (!invite) return next(new UnprocessableContentError());
  if (req.user!.id !== invite.employee.toString()) return next(new UnauthorizedAccessError());

  (req.user as EmployeeDocument).organization = invite.organization;
  invite.status = "accepted";

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await req.user!.save({ session });
    await invite.save({ session });
    await session.commitTransaction();
    return res.status(200).json({ status: "success", message: "Onboarding invite accepted!" });
  } catch {
    await session.abortTransaction();
    return next(new AppError("Action failed. Something went wrong", 500));
  } finally {
    await session.endSession();
  }
});

export const rejectInvite = catchAsyncError(async (req, res, next) => {
  const { inviteId } = req.params;
  if (!inviteId) return next(new BadRequestError());

  const invite = await OnboardingInvite.findById(inviteId);
  if (!invite) return next(new UnprocessableContentError());
  if ((req.user as EmployeeDocument).id !== invite.employee.toString())
    return next(new UnauthorizedAccessError());

  invite.status = "rejected";
  await invite.save();
  return res.status(200).json({ status: "success", message: "Oboarding invite rejected" });
});
