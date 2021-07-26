import "express-async-errors";
import AppWrapper from "./infrastructure/server/AppWrapper";
import { HttpServer } from "./infrastructure/server/HttpServer";
import handlerErrorMiddleware from "./infrastructure/middleware/error";
import BaseController from "./adapters/controllers/base/BaseController";

// Region controllers
import healthController from "./adapters/controllers/health/HealthController";
import authController from "./adapters/controllers/auth/AuthController";
// End controllers

const controllers: BaseController[] = [healthController, authController];

const appWrapper = new AppWrapper(controllers);

const server = new HttpServer(appWrapper);
server.listen();

process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
  handlerErrorMiddleware.manageNodeException(error);
});

process.on("unhandledRejection", (reason: NodeJS.UncaughtExceptionListener) => {
  handlerErrorMiddleware.manageNodeException(reason);
});
