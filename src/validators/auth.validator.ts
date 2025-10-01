import { body } from "express-validator";
import { Role } from "@prisma/client";

export const registerValidator = [
  body("fullName").isString().notEmpty().withMessage("fullName обязателен"),
  body("birthDate")
    .isISO8601()
    .toDate()
    .withMessage("birthDate должна быть датой"),
  body("email").isEmail().withMessage("Неверный email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен быть не менее 6 символов"),
  body("role")
    .optional()
    .isIn(Object.keys(Role))
    .withMessage("role должен быть USER или ADMIN"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Неверный email"),
  body("password").isString().notEmpty().withMessage("Пароль обязателен"),
];
