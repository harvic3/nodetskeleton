import { HttpHeaderEnum } from "../../../adapters/controllers/base/context/HttpHeader.enum";
import { IRequest } from "../../../adapters/controllers/base/context/IRequest";
import { IResponse } from "../../../adapters/controllers/base/Base.controller";
import { UseCaseTrace } from "../../../application/shared/log/UseCaseTrace";
import { NextFunction, Request, Response } from "../../app/core/Modules";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import GuidUtil from "../../../application/shared/utils/GuidUtil";
import { ISession } from "../../../domain/session/ISession";
import { Middleware } from "../types";

class UseCaseTraceMiddleware {
  handle: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    TypeParser.cast<IResponse>(res).trace = new UseCaseTrace(
      TypeParser.cast<IRequest>(req).isWhiteList
        ? TypeParser.cast<ISession>({})
        : TypeParser.cast<IRequest>(req).session,
      new Date(),
      TypeParser.cast<IRequest>(req).origin,
      (req.headers[HttpHeaderEnum.TRANSACTION_ID] as string) || GuidUtil.getV4WithoutDashes(),
    )
      .setRequest({
        params: req.params,
        query: req.query,
        body: undefined,
      })
      .setClient({
        ip: TypeParser.cast<IRequest>(req).ipAddress,
        agent: TypeParser.cast<IRequest>(req).userAgent,
      });

    return next();
  };
}

export default new UseCaseTraceMiddleware();
