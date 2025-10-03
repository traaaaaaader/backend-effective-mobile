import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { config } from "./config/config";

import { authRouter, userRouter } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use(errorMiddleware);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
