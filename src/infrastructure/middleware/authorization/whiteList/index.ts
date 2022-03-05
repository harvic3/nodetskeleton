import { NextFunction, Request, Response } from "../../../app/core/Modules";
import { BooleanUtils } from "../../../../domain/shared/utils/BooleanUtils";
import config from "../../../config";
import { Middleware } from "../..";

const ROUTE_WHITE_LIST = [
  `${config.Server.Root}/ping`,
  `${config.Server.Root}/v1/users/login`,
  `${config.Server.Root}/v1/users/sign-up`,
];

class RouteWhiteListMiddleware {
  handle: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    const existsUnauthorizedPath = ROUTE_WHITE_LIST.some((path) => path === req.path);
    req.isWhiteList = BooleanUtils.FALSE;

    if (existsUnauthorizedPath) {
      req.isWhiteList = BooleanUtils.TRUE;
    }

    return next();
  };
}

export default new RouteWhiteListMiddleware();
