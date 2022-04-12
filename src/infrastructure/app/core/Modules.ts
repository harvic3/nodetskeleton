import * as appServer from "express";

const Router = appServer.Router;

export {
  Request,
  Response,
  NextFunction,
  Application,
  Router,
  RequestHandler,
  RequestParamHandler,
  ErrorRequestHandler,
  json as bodyParser,
  urlencoded,
} from "express";
export { appServer as ServerApp };
