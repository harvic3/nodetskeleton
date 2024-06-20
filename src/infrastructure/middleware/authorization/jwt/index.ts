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
  handle: Middleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (TypeParser.cast<IRequest>(req).isWhiteList) return next();

    const auth = req.headers.authorization;

    if (!auth) return this.authorizationInvalid(next);

    const jwtParts = ArrayUtil.allOrDefault(auth.split(/\s+/));
    if (jwtParts.length !== TOKEN_PARTS) return this.authorizationInvalid(next);

    const authProvider = kernel.get<AuthProvider>(AuthorizationMiddleware.name, AuthProvider.name);

    const token = ArrayUtil.getWithIndex(jwtParts, TOKEN_POSITION_VALUE);
    const sessionResult = TryWrapper.exec(authProvider.verifyJwt, [token]);
    if (!sessionResult.success) return this.authorizationInvalid(next);

    const session = TypeParser.cast<ISession>(sessionResult.value);
    const logoffResult = await TryWrapper.asyncExec(
      authProvider.hasSessionInvalid(session.sessionId),
    );
    if (!!logoffResult.value) return this.authorizationInvalid(next);

    TypeParser.cast<IRequest>(req).session = session;

    return next();
  };

  private getUnauthorized(message: string): ApplicationError {
    return new ApplicationError(
      AuthorizationMiddleware.name,
      message,
      applicationStatus.UNAUTHORIZED,
    );
  }

  private authorizationInvalid(next: NextFunction): void {
    return next(this.getUnauthorized(appMessages.get(appMessages.keys.AUTHORIZATION_REQUIRED)));
  }
}

export default new AuthorizationMiddleware();
