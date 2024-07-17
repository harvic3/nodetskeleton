import { IRequest } from "../../../../adapters/controllers/base/context/IRequest";
import { NextFunction, Request, Response } from "../../../app/core/Modules";
import { BooleanUtil } from "../../../../domain/shared/utils/BooleanUtil";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { Middleware } from "../../types";
import config from "../../../config";

const ROUTE_WHITE_LIST: { rule: "starts-with" | "equal"; value: string }[] = [
  { rule: "equal", value: `${config.Server.Root}/status` },
  { rule: "equal", value: `${config.Server.Root}/v1/auth/login` },
  { rule: "equal", value: `${config.Server.Root}/v1/users/sign-up` },
  { rule: "starts-with", value: `${config.Server.Root}/docs` },
];

class RouteWhiteListMiddleware {
  handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    const existsUnauthorizedPath = ROUTE_WHITE_LIST.some((route) =>
      route.rule === "equal"
        ? BooleanUtil.areEqual(route.value, req.path)
        : req.path.startsWith(route.value),
    );

    TypeParser.cast<IRequest>(req).isWhiteList = existsUnauthorizedPath;

    return next();
  };
}

export default new RouteWhiteListMiddleware();
