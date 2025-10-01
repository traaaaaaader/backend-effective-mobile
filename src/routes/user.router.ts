import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  listUsersValidator,
  setActiveValidator,
  userIdValidator,
} from "../validators/user.validator";
import { validate } from "../middlewares/validate.middleware";

const prisma = new PrismaClient();
const userService = new UserService(prisma);
const userController = new UserController(userService);

const router = Router();

router.get(
  "/:id",
  authMiddleware,
  userIdValidator,
  validate,
  userController.getById
);
router.get(
  "/",
  authMiddleware,
  listUsersValidator,
  validate,
  userController.list
);
router.patch(
  "/:id/active",
  authMiddleware,
  setActiveValidator,
  validate,
  userController.setActive
);

export { router as userRouter };
