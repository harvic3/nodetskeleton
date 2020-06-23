import App from "./infraestructure/server/App";

// Region controllers
import TextFeelingController from "./controllers/TextFeeling.controller";

// End controllers

const controllers = [
  new TextFeelingController(),
];

const app = new App(controllers);

app.Listen();