import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { RegisterDto, LoginDto } from "../dto/user.dto";

export class AuthController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: RegisterDto = req.body;
      const user = await this.userService.register(dto);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: LoginDto = req.body;
      const result = await this.userService.authenticate(dto);
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.json(result.user);
    } catch (error) {
      next(error);
    }
  };
}
