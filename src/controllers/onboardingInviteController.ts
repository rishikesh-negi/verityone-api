import { format } from "date-fns";
import mongoose from "mongoose";
import {
  AppError,
  BadRequestError,
  NotFoundError,
  UnauthorizedAccessError,
  UnprocessableContentError,
} from "../errors/AppError.js";
import { Employee, type EmployeeDocument } from "../models/employeeModel.js";
import { OnboardingInvite } from "../models/onboardingInviteModel.js";
import { Workplace, type WorkplaceDocument } from "../models/workplaceModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { INVITE_VALIDITY_SECONDS, WORKPLACE_FIELDS_TO_POPULATE } from "../utils/constants.js";

export const createInvite = catchAsyncError<WorkplaceDocument>(async (req, res, next) => {
  const { employeeId } = req.params;
  if (!employeeId) return next(new BadRequestError());

  const employee = await Employee.findById(employeeId);
  if (!employee) return next(new NotFoundError("Employee not found"));
  if (employee.workplace !== null)
    return next(
      new AppError("Employee was onboarded by another workplace", 403, "employee-not-available"),
    );

  const existingInvite = await OnboardingInvite.findOne({
    workplace: req.user.id,
    employee: employeeId,
  })
    .setOptions({ includeAllInvites: true })
    .select("+createdAt");

  if (existingInvite) {
    const inviteExpiryTimestamp =
      existingInvite.createdAt.getTime() + INVITE_VALIDITY_SECONDS * 1000;
    const inviteExpiryDateString = format(inviteExpiryTimestamp, "MMM dd, yyyy");
    return next(
      new AppError(
        `Cannot invite this employee again until ${inviteExpiryDateString}`,
        403,
        "invite-exists",
      ),
    );
  }

  await OnboardingInvite.create({ workplace: req.user.id, employee: employeeId });
  return res.status(201).json({
    status: "success",
    message: `Invite sent to ${employee.firstName}`,
  });
});

export const getAllSentInvites = catchAsyncError<WorkplaceDocument>(async (req, res, next) => {
  const sentInvites = await OnboardingInvite.find({
    workplace: req.user.id,
  });
  if (!sentInvites)
    return next(new UnprocessableContentError("Failed to retrieve onboarding invites"));

  return res.status(200).json({
    status: "success",
    sentInvites,
  });
});

export const retractInvite = catchAsyncError<WorkplaceDocument>(async (req, res, next) => {
  const { inviteId } = req.params;
  if (!inviteId) return next(new UnprocessableContentError("Invalid invite ID received"));

  const invite = await OnboardingInvite.findById(inviteId);
  if (!invite) return next(new NotFoundError("Invite not found"));

  invite.status = "retracted";
  invite.save();
  return res.sendStatus(204);
});

export const getEmployeeInvites = catchAsyncError<EmployeeDocument>(async (req, res, next) => {
  const invites = await OnboardingInvite.find({ employee: req.user.id, status: "pending" });
  if (!invites) return next(new AppError("Failed to retrieve onboarding invites", 500));

  return res.status(200).json({ status: "success", invites });
});

export const acceptInvite = catchAsyncError<EmployeeDocument>(async (req, res, next) => {
  const { inviteId } = req.params;
  if (!inviteId) return next(new BadRequestError());

  const invite = await OnboardingInvite.findById(inviteId);
  if (!invite) return next(new NotFoundError("Invite not found"));
  if (req.user.id !== invite.employee.toString()) return next(new UnauthorizedAccessError());

  const workplaceExists = await Workplace.exists({ _id: invite.workplace, active: true });
  if (!workplaceExists) {
    invite.status = "orphaned";
    await invite.save();
    return next(
      new AppError("Workplace not found or no longer exists", 404, "workplace-not-found"),
    );
  }

  req.user.workplace = invite.workplace;
  invite.status = "accepted";

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Workplace.findByIdAndUpdate(invite.workplace, { $inc: { numEmployees: 1 } }, { session });
    req.user = await req.user.save({ session });
    req.user = await req.user.populate({
      path: "workplace",
      select: WORKPLACE_FIELDS_TO_POPULATE,
      options: { session },
    });
    await invite.save({ session });
    await session.commitTransaction();
    return res
      .status(200)
      .json({ status: "success", message: "Onboarding invite accepted!", user: req.user });
  } catch {
    await session.abortTransaction();
    return next(new AppError("Action failed. Something went wrong", 500));
  } finally {
    await session.endSession();
  }
});

export const rejectInvite = catchAsyncError<EmployeeDocument>(async (req, res, next) => {
  const { inviteId } = req.params;
  if (!inviteId) return next(new BadRequestError());

  const invite = await OnboardingInvite.findById(inviteId);
  if (!invite) return next(new UnprocessableContentError());
  if (req.user.id !== invite.employee.toString()) return next(new UnauthorizedAccessError());

  invite.status = "rejected";
  await invite.save();
  return res.status(200).json({ status: "success", message: "Oboarding invite rejected" });
});
