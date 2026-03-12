import dotenv from "dotenv";
dotenv.config({ path: "./config.env" }); // Path has to be relative to the root folder, not the index.ts module's path

import mongoose from "mongoose";
import app from "./app.js";
import { gracefulShutdown, shutdown } from "./utils/gracefulShutdown.js";

process.on("uncaughtException", (err) => {
  console.log("🔴 Unhandled exception encountered! Shutting down...");
  console.log(`${err.name}: ${err.message}`);
});

const DB = process.env["DATABASE"]?.replace(
  "<DB_PASSWORD>",
  encodeURIComponent(process.env["DB_PASSWORD"]!),
);

mongoose
  .connect(DB!)
  .then(
    () => process.env["NODE_ENV"] === "development" && console.log("DB successfully connected"),
  );

const PORT: number = +process.env["PORT"]! || 8000;

export const server = app.listen(
  PORT,
  "0.0.0.0",
  () => process.env["NODE_ENV"] === "development" && console.log(`App running on port ${PORT}`),
);

process.on("unhandledRejection", (err: Error) => {
  gracefulShutdown(err, `🔴 Unhandled rejection encountered! Shutting down...`, server);
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
// Why this is needed:
// To restart the service and keep it healthy, Render sends a "SIGTERM" signal, waits for ~30 seconds, sends a "SIGKILL" signal to kill the process if the app is still running. If the server shutdown is abrupt, any pending, unhandled requests will remain unhandled, and the data in the DB could corrupt.
// So, we need to listen for the "SIGTERM" signal and if the signal is detected, the server:
// 1. Stops accepting new traffic.
// 2. Cleans up resources.
// 3. Exits cleanly before timeout.
