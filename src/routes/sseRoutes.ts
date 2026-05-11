import { Router } from "express";
import { protect, restrictTo } from "../controllers/authController.js";

const router = Router();

router.use(protect);

router.get("/events/new-survey", restrictTo("Employee"));
