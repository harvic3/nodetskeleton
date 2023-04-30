import { HttpHeaderEnum } from "../../../adapters/controllers/base/context/HttpHeader.enum";
import { IContext } from "../../../adapters/controllers/base/Base.controller";
import { DefaultValue } from "../../../domain/shared/utils/DefaultValue";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { Context, Next } from "../../app/core/Modules";
import { Middleware } from "../types";

class ClientInfoMiddleware {
  handle: Middleware = (ctx: Context, next: Next): Promise<void> => {
    TypeParser.cast<IContext>(ctx).ipAddress = DefaultValue.evaluateAndGet(
      ctx.ip,
      ctx.headers[HttpHeaderEnum.FORWARDED_FOR] as string,
    );
    TypeParser.cast<IContext>(ctx).userAgent = ctx.headers[HttpHeaderEnum.USER_AGENT] as string;
    TypeParser.cast<IContext>(ctx).clientIP = DefaultValue.evaluateAndGet(
      ctx.request.ip,
      ctx.request.origin,
    );

    return next();
  };
}

export default new ClientInfoMiddleware();
