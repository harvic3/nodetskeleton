import "express-async-errors";
import AppWrapper from "./infrastructure/app/AppWrapper";
import { HttpServer } from "./infrastructure/app/server/HttpServer";
import errorHandlerMiddleware from "./infrastructure/middleware/error";
import BaseController from "./adapters/controllers/base/BaseController";

// Controllers region
import healthController from "./adapters/controllers/health/HealthController";
import authController from "./adapters/controllers/auth/AuthController";
// End controllers

const controllers: BaseController[] = [healthController, authController];

const appWrapper = new AppWrapper(controllers);

const server = new HttpServer(appWrapper);
server.start();

process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
  errorHandlerMiddleware.manageNodeException(error);
});

process.on("unhandledRejection", (reason: NodeJS.UncaughtExceptionListener) => {
  errorHandlerMiddleware.manageNodeException(reason);
});
