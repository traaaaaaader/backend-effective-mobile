import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserService } from "../services/user.service";
import { PrismaClient } from "@prisma/client";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";
import { validate } from "../middlewares/validate.middleware";

const prisma = new PrismaClient();
const userService = new UserService(prisma);
const authController = new AuthController(userService);

const router = Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);

export { router as authRouter };
