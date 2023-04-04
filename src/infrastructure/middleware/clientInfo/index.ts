import { HttpHeaderEnum } from "../../../adapters/controllers/base/context/HttpHeader.enum";
import { IRequest } from "../../../adapters/controllers/base/context/IRequest";
import { NextFunction, Request, Response } from "../../app/core/Modules";
import { DefaultValue } from "../../../domain/shared/utils/DefaultValue";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { Middleware } from "../types";

class ClientInfoMiddleware {
  handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    TypeParser.cast<IRequest>(req).ipAddress = DefaultValue.evaluateAndGet(
      req.ip,
      req.headers[HttpHeaderEnum.FORWARDED_FOR] as string,
    );
    TypeParser.cast<IRequest>(req).userAgent = req.headers[HttpHeaderEnum.USER_AGENT] as string;
    TypeParser.cast<IRequest>(req).origin = (req.headers[HttpHeaderEnum.ORIGIN] ||
      req.headers[HttpHeaderEnum.REFERRER]) as string;

    return next();
  };
}

export default new ClientInfoMiddleware();
