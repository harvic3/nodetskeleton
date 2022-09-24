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
      this.getOrigin(req),
      (req.headers["x-transaction-id"] as string) || GuidUtil.getV4WithoutDashes(),
    )
      .setRequest({
        params: req.params,
        query: req.query,
        body: undefined,
      })
      .setClient({
        ip: (req.headers["x-forwarded-for"] || req.ip) as string,
        agent: req.headers["user-agent"] as string,
      });

    return next();
  };

  private getOrigin(req: Request): string {
    return (req.headers["origin"] || req.headers["referrer"]) as string;
  }
}

export default new UseCaseTraceMiddleware();
