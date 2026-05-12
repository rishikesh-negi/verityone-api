import { Router } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import { subscribeToPublicSSE } from "../controllers/sseController.js";

const router = Router();

router.use(protect);

router.get("/events", subscribeToPublicSSE);
router.get("/events/new-survey", restrictTo("Employee"));
