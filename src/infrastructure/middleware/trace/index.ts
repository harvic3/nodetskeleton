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
      this.getOrigin(ctx),
      (ctx.headers["x-transaction-id"] as string) || GuidUtil.getV4WithoutDashes(),
    )
      .setRequest({
        params: ctx.params,
        query: ctx.query,
        body: undefined,
      })
      .setClient({
        ip: (ctx.headers["x-forwarded-for"] || ctx.ip) as string,
        agent: ctx.headers["user-agent"] as string,
      });

    return next();
  };

  private getOrigin(ctx: Context): string {
    return (ctx.headers["origin"] || ctx.headers["referrer"]) as string;
  }
}

export default new UseCaseTraceMiddleware();
