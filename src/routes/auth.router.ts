import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { AuthController } from "../controllers";
import { UserService } from "../services/user.service";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";
import { validateMiddleware } from "../middlewares";

const prisma = new PrismaClient();
const userService = new UserService(prisma);
const authController = new AuthController(userService);

const router = Router();

router.post(
  "/register",
  registerValidator,
  validateMiddleware,
  authController.register
);
router.post("/login", loginValidator, validateMiddleware, authController.login);

export { router as authRouter };
