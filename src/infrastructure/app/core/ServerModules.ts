import * as ServerApp from "express";

const Router = ServerApp.Router;

export {
  Response,
  NextFunction,
  Application,
  Router as RouterType,
  json as bodyParser,
  urlencoded,
} from "express";
export { ServerApp, Router };
