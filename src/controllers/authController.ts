import { AppError } from "../errors/AppError.js";
import { Employee, type EmployeeDocument } from "../models/employeeModel.js";
import { Organization } from "../models/organizationModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import Email from "../utils/email.js";
import { generateToken } from "../utils/generateToken.js";
import { createRefreshToken, verifyAuthJWT } from "../utils/jwt.js";

export const signUpEmployee = catchAsyncError(async (req, res) => {
  const newUser: EmployeeDocument = await Employee.create(req.body);

  const { token, hashedToken } = generateToken();
  newUser.emailVerificationToken = hashedToken;
  newUser.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await newUser.save();

  const emailVerificationUrl = `${req.protocol}://${req.get("host")}/verify-email`;
  await new Email(newUser, emailVerificationUrl).sendWelcome();

  const { refreshToken, tokenHash, expiresAt } = createRefreshToken(newUser, {
    id: newUser.id,
    accountType: "employee",
  });
});

export const protect = catchAsyncError(async function (req, res, next) {
  const accessToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!accessToken)
    return next(new AppError("Unauthorized Access: Token expired", 401));

  const decoded = await verifyAuthJWT(accessToken, "access");
  if (!decoded.iat)
    return next(new AppError("Unable to verify access token", 401));

  const sessionUser =
    (await Employee.findById(decoded?.["id"])) ||
    (await Organization.findById(decoded?.["id"]));

  if (!sessionUser)
    return next(new AppError("Unauthorized Access: User not found!", 401));

  if (sessionUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        "Token Expired: Log in again with the updated password",
        401,
      ),
    );
  }
});
