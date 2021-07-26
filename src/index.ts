import "express-async-errors";
import AppWrapper from "./infrastructure/server/AppWrapper";
import BaseController from "./adapters/controllers/base/BaseController";

// Region controllers
import healthController from "./adapters/controllers/health/HealthController";
import authController from "./adapters/controllers/auth/AuthController";
import { HttpServer } from "./infrastructure/server/HttpServer";
// End controllers

const controllers: BaseController[] = [healthController, authController];

const appWrapper = new AppWrapper(controllers);

const server = new HttpServer(appWrapper);
server.listen();
