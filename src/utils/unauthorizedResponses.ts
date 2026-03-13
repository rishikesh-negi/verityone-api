import type { Response } from "express";

export const sendNoAccessTokenResponse = (res: Response) =>
  res.status(400).json({
    status: "fail",
    reason: "no-access-token",
    message: "Unauthorized Access: No access token found",
  });

export const sendInvalidTokenResponse = (res: Response) =>
  res.status(401).json({
    status: "fail",
    reason: "unprocessable-token",
    message: "Unauthorized Access: Invalid access token",
  });

export const sendAccessTokenExpiredResponse = (res: Response) =>
  res.status(401).json({
    status: "fail",
    reason: "access-token-expired",
    message: "Unauthorized Access: Access token expired",
  });

export const sendRefreshTokenExpiredResponse = (res: Response) =>
  res.status(401).json({
    status: "fail",
    reason: "refresh-token-expired",
    message: "Login Required: Refresh token expired",
  });

export const sendUserNotFoundResponse = (res: Response) =>
  res.status(404).json({
    status: "fail",
    reason: "user-not-found",
    message: "User not found",
  });

export const sendVerificationWindowExpiredResponse = (res: Response) =>
  res.status(401).json({
    status: "fail",
    reason: "verification-window-expired",
    message: "Email verification window expired. Please sign up again",
  });

export const sendUnverifiedEmailResponse = (res: Response) =>
  res.status(401).json({
    status: "fail",
    reason: "email-unverified",
    message: "Please verify your email address first",
  });

export const sendReloginAfterPasswordChangeResponse = (res: Response) =>
  res.status(401).json({
    status: "fail",
    reason: "password-changed",
    message: "Log in with your updated password",
  });

export const sendSessionCompromisedResponse = (res: Response) =>
  res.status(403).json({
    status: "fail",
    reason: "session-compromised",
    message: "Session compromised. Logged out of all devices",
  });
