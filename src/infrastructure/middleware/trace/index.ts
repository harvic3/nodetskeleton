import { HttpHeaderEnum } from "../../../adapters/controllers/base/context/HttpHeader.enum";
import { IContext } from "../../../adapters/controllers/base/Base.controller";
import { UseCaseTrace } from "../../../application/shared/log/UseCaseTrace";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import GuidUtil from "../../../application/shared/utils/GuidUtil";
import { ISession } from "../../../domain/session/ISession";
import { Context, Next } from "../../app/core/Modules";
import { Middleware } from "../types";

class UseCaseTraceMiddleware {
  handle: Middleware = (ctx: Context, next: Next): Promise<void> => {
    TypeParser.cast<IContext>(ctx).trace = new UseCaseTrace(
      TypeParser.cast<IContext>(ctx).isWhiteList
        ? TypeParser.cast<ISession>({})
        : TypeParser.cast<IContext>(ctx).session,
      new Date(),
      TypeParser.cast<IContext>(ctx).clientIP,
      (ctx.headers[HttpHeaderEnum.TRANSACTION_ID] as string) || GuidUtil.getV4WithoutDashes(),
    )
      .setRequest({
        params: ctx.params,
        query: ctx.query,
        body: undefined,
      })
      .setClient({
        ip: TypeParser.cast<IContext>(ctx).ipAddress,
        agent: TypeParser.cast<IContext>(ctx).userAgent,
      });

    return next();
  };
}

export default new UseCaseTraceMiddleware();
