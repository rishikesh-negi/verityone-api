import { Router, type RequestHandler } from "express";
import { login, logout, protect, signup } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginCredentialsSchema, signupRequestSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/signup", validateRequest(signupRequestSchema) as RequestHandler, signup);
router.post("/login", validateRequest(loginCredentialsSchema) as RequestHandler, login);
router.get("/logout", logout);

router.use(protect);

export default router;
