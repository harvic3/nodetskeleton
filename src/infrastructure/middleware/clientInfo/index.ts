import { HttpHeaderEnum } from "../../../adapters/controllers/base/context/HttpHeader.enum";
import { IContext } from "../../../adapters/controllers/base/Base.controller";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { Context, Next } from "../../app/core/Modules";
import { Middleware } from "../types";

class ClientInfoMiddleware {
  handle: Middleware = (ctx: Context, next: Next): Promise<void> => {
    TypeParser.cast<IContext>(ctx).ipAddress = ctx.ip || (ctx.headers[HttpHeaderEnum.FORWARDED_FOR] as string);
    TypeParser.cast<IContext>(ctx).userAgent = ctx.headers[HttpHeaderEnum.USER_AGENT] as string;
    TypeParser.cast<IContext>(ctx).origin = (ctx.headers[HttpHeaderEnum.ORIGIN] ||
      ctx.headers[HttpHeaderEnum.REFERRER]) as string;

    return next();
  };
}

export default new ClientInfoMiddleware();
