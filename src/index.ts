import App from "./infraestructure/server/App";

// Region controllers
import textFeelingController from "./controllers/TextFeeling.controller";

// End controllers

const controllers = [textFeelingController];

const app = new App(controllers);

app.Listen();
