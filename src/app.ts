import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import path from "path";
import { sanitizeRequest } from "./utils/sanitizeData.js";
import { AppError } from "./errors/AppError.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";

const app = express();

const allowedOrigins = [
  "http://localhost:8000",
  "https://verityone.vercel.app",
];

app.enable("trust proxy");
app.use(
  cors({
    origin(origin, callback) {
      if (allowedOrigins.indexOf(origin!) !== -1) callback(null, true);
      else callback(new Error("Not allowed by the API's CORS policy"));
    },
    credentials: true,
  }),
);
app.options("*", cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(helmet());

// To be updated:
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//     },
//   }),
// );

if (process.env["NODE_ENV"] === "development") app.use(morgan("dev"));

const limiter = rateLimit({
  limit: 120,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many successive requests detected in a short span of time from your IP address. Pleaset try again after some time.",
});
app.use("/api", limiter);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());
app.use(sanitizeRequest);

// To be added here:
// 1. Use zod for input validation.
// 2. Implement output escaping (prevent XSS).
// 3. Security headers using hemlet.
// 4. MongoDB injection protection.

app.disable("x-powered-by");
app.use(
  hpp({
    // TBD - Add all valid http parameter names to the whitelist:
    whitelist: [],
  }),
);
app.use((req, _res, next) => {
  req.requestTime = new Date().toString();
  next();
});

// Mount routers here:

app.all("*", (req, _res, next) => {
  next(
    new AppError(
      `The requested resource ${req.originalUrl} does not exist`,
      404,
    ),
  );
});

app.use(globalErrorHandler);

export default app;
