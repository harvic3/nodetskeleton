import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import applicationStatus from "../../../../application/shared/status/applicationStatus";
import { AuthProvider } from "../../../../adapters/providers/auth/Auth.provider";
import appMessages from "../../../../application/shared/locals/messages";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import ArrayUtil from "../../../../domain/shared/utils/ArrayUtil";
import { ISession } from "../../../../domain/session/ISession";
import { Context, Next } from "../../../app/core/Modules";
import kernel from "../../../../adapters/shared/kernel";
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

    const token = ArrayUtil.getWithIndex(jwtParts, TOKEN_POSITION_VALUE);
    const sessionResult = TryWrapper.exec(
      kernel.get<AuthProvider>(AuthorizationMiddleware.name, AuthProvider.name).verifyJwt,
      [token],
    );
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
