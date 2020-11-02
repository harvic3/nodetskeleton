import "express-async-errors"; // For ExpressJs only
import App from "./infrastructure/server/App";
import BaseController from "./adapters/controllers/BaseController";

// Region controllers
import healthController from "./adapters/controllers/health/HealthController";
import textFeelingController from "./adapters/controllers/textFeeling/TextFeelingController";
// End controllers

const controllers: BaseController[] = [healthController, textFeelingController];

const app = new App(controllers);

app.Start();
