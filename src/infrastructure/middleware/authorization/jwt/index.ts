import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import applicationStatus from "../../../../application/shared/status/applicationStatus";
import appMessages from "../../../../application/shared/locals/messages";
import { authProvider } from "../../../../adapters/providers/container";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import ArrayUtil from "../../../../domain/shared/utils/ArrayUtil";
import { ISession } from "../../../../domain/session/ISession";
import { Context, Next } from "../../../app/core/Modules";
import { Middleware } from "../../types";

const TOKEN_PARTS = 2;
const TOKEN_POSITION_VALUE = 1;

class AuthorizationMiddleware {
  handle: Middleware = (ctx: Context, next: Next): Promise<void> => {
    if (ctx.isWhiteList) return next();

    const auth = ctx.request.headers.authorization;

    if (!auth)
      // return next(this.getUnauthorized(appMessages.get(appMessages.keys.AUTHORIZATION_REQUIRED)));
      return Promise.resolve();

    const jwtParts = ArrayUtil.allOrDefault(auth.split(/\s+/));
    if (jwtParts.length !== TOKEN_PARTS)
      // return next(this.getUnauthorized(appMessages.get(appMessages.keys.AUTHORIZATION_REQUIRED)));
      return Promise.resolve();

    const token = ArrayUtil.getIndex(jwtParts, TOKEN_POSITION_VALUE);
    const sessionResult = TryWrapper.exec(authProvider.verifyJwt, [token]);
    if (!sessionResult.success)
      // return next(this.getUnauthorized(appMessages.get(appMessages.keys.AUTHORIZATION_REQUIRED)));
      return Promise.resolve();

    ctx.session = TypeParser.cast<ISession>(sessionResult.value);

    return next();
  };

  private getUnauthorized(message: string): ApplicationError {
    return new ApplicationError(
      AuthorizationMiddleware.name,
      message,
      applicationStatus.UNAUTHORIZED,
    );
  }
}

export default new AuthorizationMiddleware();
