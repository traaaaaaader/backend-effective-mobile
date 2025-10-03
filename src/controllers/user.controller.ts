import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { ListUsersOptions } from "../dto/user.dto";
import AppError from "../utils/AppError";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export class UserController {
  constructor(private userService: UserService) {}

  getById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) throw new AppError("Не авторизован", 401);

      const targetId = Number(req.params.id);
      const requesterId = req.user.id;
      const user = await this.userService.getById(requesterId, targetId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) throw new AppError("Не авторизован", 401);

      const requesterId = req.user.id;
      const opts: ListUsersOptions = {
        skip: req.query.skip ? Number(req.query.skip) : undefined,
        take: req.query.take ? Number(req.query.take) : undefined,
      };
      const result = await this.userService.list(requesterId, opts);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  setActive = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) throw new AppError("Не авторизован", 401);

      const targetId = Number(req.params.id);
      const requesterId = req.user.id;
      const { isActive } = req.body;
      const user = await this.userService.setActive(
        requesterId,
        targetId,
        isActive
      );
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
