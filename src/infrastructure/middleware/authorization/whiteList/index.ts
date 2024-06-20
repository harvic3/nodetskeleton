import { IRequest } from "../../../../adapters/controllers/base/context/IRequest";
import { NextFunction, Request, Response } from "../../../app/core/Modules";
import { BooleanUtil } from "../../../../domain/shared/utils/BooleanUtil";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { Middleware } from "../../types";
import config from "../../../config";
import { StringCompare } from "./string.compare";
import { RegExpCompare } from "./regexp.compare";
import { PathEvaluation } from "./pathEvaluation";

const ROUTE_WHITE_LIST: Array<string | RegExp> = [
  `${config.Server.Root}/ping`,
  `${config.Server.Root}/v1/auth/login`,
  `${config.Server.Root}/v1/users/sign-up`,
  "/docs",
];

class RouteWhiteListMiddleware {
  private static whiteList: Array<StringCompare | RegExpCompare>;

  constructor() {
    if (RouteWhiteListMiddleware.whiteList === undefined) {
      RouteWhiteListMiddleware.whiteList = ROUTE_WHITE_LIST.map((entry) => {
        if (typeof entry === "string") return new StringCompare(entry);

        if (entry instanceof RegExp) return new RegExpCompare(entry);

        return new StringCompare("");
      }).filter((item) => item !== null);
    }
  }

  handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    const pathEvaluation = new PathEvaluation(req.path);

    const existsUnauthorizedPath = RouteWhiteListMiddleware.whiteList.some((entry) =>
      entry.allowed(pathEvaluation),
    );

    TypeParser.cast<IRequest>(req).isWhiteList = existsUnauthorizedPath;

    return next();
  };
}

export default new RouteWhiteListMiddleware();
