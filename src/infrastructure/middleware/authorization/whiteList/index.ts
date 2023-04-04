import { IRequest } from "../../../../adapters/controllers/base/context/IRequest";
import { NextFunction, Request, Response } from "../../../app/core/Modules";
import { BooleanUtil } from "../../../../domain/shared/utils/BooleanUtil";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { Middleware } from "../../types";
import config from "../../../config";

const ROUTE_WHITE_LIST = [
  `${config.Server.Root}/ping`,
  `${config.Server.Root}/v1/auth/login`,
  `${config.Server.Root}/v1/users/sign-up`,
];

class RouteWhiteListMiddleware {
  handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    TypeParser.cast<IRequest>(req).isWhiteList = false;

    const existsUnauthorizedPath = ROUTE_WHITE_LIST.some((path) =>
      BooleanUtil.areEqual(path, req.path),
    );

    if (existsUnauthorizedPath) {
      TypeParser.cast<IRequest>(req).isWhiteList = true;
    }

    return next();
  };
}

export default new RouteWhiteListMiddleware();
