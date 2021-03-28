import "express-async-errors";
import App from "./infrastructure/server/App";
import BaseController from "./adapters/controllers/base/BaseController";

// Region controllers
import healthController from "./adapters/controllers/health/HealthController";
import authController from "./adapters/controllers/auth/AuthController";
// End controllers

const controllers: BaseController[] = [healthController, authController];

const app = new App(controllers);

app.start();
