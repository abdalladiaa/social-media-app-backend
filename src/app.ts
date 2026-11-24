import "./lib/config/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./router.js";
import errorMiddleWare from "./middleware/error.middleware.js";
import dbConnection from "./DB/connection.db.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
export async function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  await dbConnection();

  app.use("/api", router);

  app.use(notFoundHandler);

  app.use(errorMiddleWare);

  return app;
}
