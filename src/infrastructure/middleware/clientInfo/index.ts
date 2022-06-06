import { IRequest } from "../../../adapters/controllers/base/context/IRequest";
import { NextFunction, Request, Response } from "../../app/core/Modules";
import { BooleanUtil } from "../../../domain/shared/utils/BooleanUtil";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { Middleware } from "../types";

class ClientInfoMiddleware {
  handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    TypeParser.cast<IRequest>(req).isWhiteList = BooleanUtil.NOT;

    TypeParser.cast<IRequest>(req).ipAddress = req.ip || (req.headers["x-forwarded-for"] as string);
    TypeParser.cast<IRequest>(req).userAgent = req.headers["user-agent"] as string;

    return next();
  };
}

export default new ClientInfoMiddleware();
