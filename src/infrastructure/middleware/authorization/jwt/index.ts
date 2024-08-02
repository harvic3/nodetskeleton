import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import { ApplicationStatus } from "../../../../application/shared/status/applicationStatus";
import { IRequest } from "../../../../adapters/controllers/base/context/IRequest";
import kernel, { AuthProvider } from "../../../../adapters/providers/container";
import { NextFunction, Request, Response } from "../../../app/core/Modules";
import appMessages from "../../../../application/shared/locals/messages";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import ArrayUtil from "../../../../domain/shared/utils/ArrayUtil";
import { ISession } from "../../../../domain/session/ISession";
import { Middleware } from "../../types";

class AuthorizationMiddleware {
  private static TOKEN_PARTS = 2;
  private static TOKEN_POSITION_VALUE = 1;

  handle: Middleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (TypeParser.cast<IRequest>(req).isWhiteList) return next();

    const auth = req.headers.authorization;

    if (!auth) return AuthorizationMiddleware.noValidAuthorization(next);

    const jwtParts = ArrayUtil.allOrDefault(auth.split(/\s+/));
    if (jwtParts.length !== AuthorizationMiddleware.TOKEN_PARTS)
      return AuthorizationMiddleware.noValidAuthorization(next);

    const token = ArrayUtil.getWithIndex(jwtParts, AuthorizationMiddleware.TOKEN_POSITION_VALUE);
    const sessionResult = TryWrapper.exec(
      kernel.get<AuthProvider>(AuthorizationMiddleware.name, AuthProvider.name).verifyJwt,
      [token],
    );
    if (!sessionResult.success) return AuthorizationMiddleware.noValidAuthorization(next);

    TypeParser.cast<IRequest>(req).session = TypeParser.cast<ISession>(sessionResult.value);

    return next();
  };

  private static getUnauthorized(message: string): ApplicationError {
    return new ApplicationError(
      AuthorizationMiddleware.name,
      message,
      ApplicationStatus.UNAUTHORIZED,
    );
  }

  private static noValidAuthorization(next: NextFunction): void {
    return next(this.getUnauthorized(appMessages.get(appMessages.keys.AUTHORIZATION_REQUIRED)));
  }
}

export default new AuthorizationMiddleware();
