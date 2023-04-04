import { Context, Next } from "../../../app/core/Modules";
import { Middleware } from "../../types";
import config from "../../../config";

const ROUTE_WHITE_LIST = [
  `${config.Server.Root}/ping`,
  `${config.Server.Root}/v1/auth/login`,
  `${config.Server.Root}/v1/users/sign-up`,
];

class RouteWhiteListMiddleware {
  handle: Middleware = (ctx: Context, next: Next): Promise<void> => {
    ctx.isWhiteList = false;

    const existsUnauthorizedPath = ROUTE_WHITE_LIST.some((path) => path === ctx.request.path);

    if (existsUnauthorizedPath) ctx.isWhiteList = true;

    return next();
  };
}

export default new RouteWhiteListMiddleware();
