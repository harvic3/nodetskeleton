import { NextFunction, Request, Response } from "../../../app/core/Modules";
import { BooleanUtil } from "../../../../domain/shared/utils/BooleanUtil";
import config from "../../../config";
import { Middleware } from "../..";

const ROUTE_WHITE_LIST = [
  `${config.Server.Root}/ping`,
  `${config.Server.Root}/v1/auth/login`,
  `${config.Server.Root}/v1/users/sign-up`,
];

class RouteWhiteListMiddleware {
  handle: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    req.isWhiteList = BooleanUtil.FALSE;

    const existsUnauthorizedPath = ROUTE_WHITE_LIST.some((path) => path === req.path);

    if (existsUnauthorizedPath) {
      req.isWhiteList = BooleanUtil.TRUE;
    }

    return next();
  };
}

export default new RouteWhiteListMiddleware();
