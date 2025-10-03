import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { UserController } from "../controllers";
import { UserService } from "../services/user.service";

import {
  listUsersValidator,
  setActiveValidator,
  userIdValidator,
} from "../validators/user.validator";
import { authMiddleware, validateMiddleware } from "../middlewares";

const prisma = new PrismaClient();
const userService = new UserService(prisma);
const userController = new UserController(userService);

const router = Router();

router.get(
  "/:id",
  authMiddleware,
  userIdValidator,
  validateMiddleware,
  userController.getById
);
router.get(
  "/",
  authMiddleware,
  listUsersValidator,
  validateMiddleware,
  userController.list
);
router.patch(
  "/:id/active",
  authMiddleware,
  setActiveValidator,
  validateMiddleware,
  userController.setActive
);

export { router as userRouter };
