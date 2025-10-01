import { PrismaClient, Prisma, Role, User as PrismaUser } from "@prisma/client";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  RegisterDto,
  LoginDto,
  AuthResult,
  SafeUser,
  ListUsersOptions,
} from "../dto/user.dto";
import AppError from "../utils/AppError";
import { config } from "../config/config";

export class UserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async register(dto: RegisterDto): Promise<SafeUser> {
    try {
      const email = dto.email.toLowerCase().trim();

      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) throw new AppError("Email уже используется", 409);

      const hashed = await bcrypt.hash(dto.password, config.bcrypt.rounds);
      const role =
        dto.role && (dto.role === "ADMIN" || dto.role === "USER")
          ? (dto.role as Role)
          : Role.USER;

      const birthDate =
        dto.birthDate instanceof Date ? dto.birthDate : new Date(dto.birthDate);

      const created = await this.prisma.user.create({
        data: {
          fullName: dto.fullName,
          birthDate,
          password: hashed,
          email,
          role,
        },
      });

      return this.excludePassword(created);
    } catch (error: any) {
      throw new AppError(
        `Ошибка при регистрации пользователя: ${error.message}`,
        500
      );
    }
  }

  async authenticate(dto: LoginDto): Promise<AuthResult> {
    try {
      const email = dto.email.toLowerCase().trim();
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new AppError("Неверные учетные данные", 401);
      if (!user.isActive) throw new AppError("Аккаунт заблокирован", 403);

      const ok = await bcrypt.compare(dto.password, user.password);
      if (!ok) throw new AppError("Неверные учетные данные", 401);

      const token = jwt.sign(
        { id: user.id, role: user.role },
        config.jwt.secret,
        {
          expiresIn: config.jwt.expiresIn,
        }
      );

      return { user: this.excludePassword(user), token };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Ошибка при авторизации: ${error.message}`, 500);
    }
  }

  async getById(requesterId: number, targetId: number): Promise<SafeUser> {
    try {
      const requester = await this.prisma.user.findUnique({
        where: { id: requesterId },
      });
      if (!requester)
        throw new AppError("Пользователь-запросчик не найден", 404);

      if (requester.role !== Role.ADMIN && requesterId !== targetId) {
        throw new AppError("Нет прав на просмотр этого пользователя", 403);
      }

      const target = await this.prisma.user.findUnique({
        where: { id: targetId },
      });
      if (!target) throw new AppError("Пользователь не найден", 404);

      return this.excludePassword(target);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Ошибка при получении пользователя: ${error.message}`,
        500
      );
    }
  }

  async list(
    requesterId: number,
    opts: ListUsersOptions = {}
  ): Promise<{ items: SafeUser[]; total: number; skip: number; take: number }> {
    try {
      const requester = await this.prisma.user.findUnique({
        where: { id: requesterId },
      });
      if (!requester)
        throw new AppError("Пользователь-запросчик не найден", 404);
      if (requester.role !== Role.ADMIN)
        throw new AppError(
          "Только админ может просматривать список пользователей",
          403
        );

      const skip = opts.skip ?? 0;
      const take = opts.take ?? 20;

      const where: Prisma.UserWhereInput | undefined = opts.search
        ? {
            OR: [
              { fullName: { contains: opts.search, mode: "insensitive" } },
              { email: { contains: opts.search, mode: "insensitive" } },
            ],
          }
        : undefined;

      const [items, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
        }),
        this.prisma.user.count({ where }),
      ]);

      return { items: items.map(this.excludePassword), total, skip, take };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Ошибка при получении списка пользователей: ${error.message}`,
        500
      );
    }
  }

  async setActive(
    requesterId: number,
    targetId: number,
    isActive: boolean
  ): Promise<SafeUser> {
    try {
      const requester = await this.prisma.user.findUnique({
        where: { id: requesterId },
      });
      if (!requester)
        throw new AppError("Пользователь-запросчик не найден", 404);

      if (requester.role !== Role.ADMIN && requesterId !== targetId) {
        throw new AppError("Нет прав на изменение статуса пользователя", 403);
      }

      const updated = await this.prisma.user.update({
        where: { id: targetId },
        data: { isActive },
      });

      return this.excludePassword(updated);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Ошибка при изменении статуса пользователя: ${error.message}`,
        500
      );
    }
  }

  private excludePassword(user: PrismaUser): SafeUser {
    const { password, ...rest } = user;
    return rest;
  }
}
