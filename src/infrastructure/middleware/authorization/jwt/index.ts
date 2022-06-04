import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import applicationStatus from "../../../../application/shared/status/applicationStatus";
import { IRequest } from "../../../../adapters/controllers/base/context/IRequest";
import kernel, { AuthProvider } from "../../../../adapters/providers/container";
import { NextFunction, Request, Response } from "../../../app/core/Modules";
import appMessages from "../../../../application/shared/locals/messages";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import ArrayUtil from "../../../../domain/shared/utils/ArrayUtil";
import { ISession } from "../../../../domain/session/ISession";
import { Middleware } from "../../types";

const TOKEN_PARTS = 2;
const TOKEN_POSITION_VALUE = 1;

class AuthorizationMiddleware {
  handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    if (TypeParser.cast<IRequest>(req).isWhiteList) return next();

    const auth = req.headers.authorization;

    if (!auth)
      return next(this.getUnauthorized(appMessages.get(appMessages.keys.AUTHORIZATION_REQUIRED)));

    const jwtParts = ArrayUtil.allOrDefault(auth.split(/\s+/));
    if (jwtParts.length !== TOKEN_PARTS)
      return next(this.getUnauthorized(appMessages.get(appMessages.keys.AUTHORIZATION_REQUIRED)));

    const token = ArrayUtil.getWithIndex(jwtParts, TOKEN_POSITION_VALUE);
    const sessionResult = TryWrapper.exec(
      kernel.get<AuthProvider>(AuthorizationMiddleware.name, AuthProvider.name).verifyJwt,
      [token],
    );
    if (!sessionResult.success)
      return next(this.getUnauthorized(appMessages.get(appMessages.keys.AUTHORIZATION_REQUIRED)));

    TypeParser.cast<IRequest>(req).session = TypeParser.cast<ISession>(sessionResult.value);

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
