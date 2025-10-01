import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

const requiredEnv = ["PORT", "DB_URL", "JWT_SECRET", "JWT_EXPIRES_IN"] as const;

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
});

export const config = {
  port: Number(process.env.PORT),
  db: {
    url: process.env.DB_URL as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
  },
  bcrypt: {
    rounds: Number(process.env.BCRYPT_ROUNDS),
  },
};
