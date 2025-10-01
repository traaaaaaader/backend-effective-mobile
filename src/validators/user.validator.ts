import { query, param, body } from "express-validator";

export const userIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("id должен быть числом > 0"),
];

export const listUsersValidator = [
  query("skip")
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage("skip должен быть >= 0"),
  query("take")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("take должен быть >= 1"),
  query("search")
    .optional()
    .isString()
    .withMessage("search должен быть строкой"),
];

export const setActiveValidator = [
  param("id").isInt({ min: 1 }).withMessage("id должен быть числом > 0"),
  body("isActive")
    .isBoolean()
    .withMessage("isActive должен быть true или false")
    .toBoolean(),
];
