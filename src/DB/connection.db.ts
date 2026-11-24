import mongoose from "mongoose";
import { logger } from "../pkg/log/logger.js";
import config from "../lib/config/config.js";
import dns from "node:dns/promises"
import AppError from "../pkg/error/error.js";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const dbConnection = async () => {
  try {
    await mongoose.connect(config.mongoose.uri);
    logger.info("DB connected");
  } catch (err) {
    logger.error(
      err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    );
    throw new AppError("fail to connect database" , 500);
  }
};

export default dbConnection;
