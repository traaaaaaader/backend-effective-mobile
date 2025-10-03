import { Role } from "@prisma/client";

export type RegisterDto = {
  fullName: string;
  birthDate: string | Date;
  email: string;
  password: string;
  role?: Role | keyof typeof Role;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type SafeUser = {
  id: number;
  fullName: string;
  birthDate: Date;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResult = {
  user: SafeUser;
  token: string;
};

export type ListUsersOptions = {
  skip?: number;
  take?: number;
};
