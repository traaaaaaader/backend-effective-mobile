import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

import { config } from "./config/config";

import { authRouter } from "./routes/auth.router";
import { userRouter } from "./routes/user.router";
import AppError from "./utils/AppError";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
