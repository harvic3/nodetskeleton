import App from "./infrastructure/server/App";
import BaseController from "./adapters/controllers/BaseController";

// Region controllers
import textFeelingController from "./adapters/controllers/textFeeling/TextFeeling.controller";
// End controllers

const controllers: BaseController[] = [textFeelingController];

const app = new App(controllers);

app.Listen();
