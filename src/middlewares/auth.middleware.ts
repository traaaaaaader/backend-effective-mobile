import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { config } from "../config/config";

interface JwtPayload {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new AppError("Не авторизован", 401);
    }

    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Токен истёк", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Неверный токен", 401));
    }
    next(error);
  }
};
