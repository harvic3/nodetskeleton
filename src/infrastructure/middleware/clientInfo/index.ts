import { IContext } from "../../../adapters/controllers/base/Base.controller";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { Context, Next } from "../../app/core/Modules";
import { Middleware } from "../types";

class ClientInfoMiddleware {
  handle: Middleware = (ctx: Context, next: Next): Promise<void> => {
    TypeParser.cast<IContext>(ctx).ipAddress = ctx.ip || (ctx.headers["x-forwarded-for"] as string);
    TypeParser.cast<IContext>(ctx).userAgent = ctx.headers["user-agent"] as string;
    TypeParser.cast<IContext>(ctx).origin = (ctx.headers["origin"] ||
      ctx.headers["referrer"]) as string;

    return next();
  };
}

export default new ClientInfoMiddleware();
