import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import { ApplicationStatus } from "../../../../application/shared/status/applicationStatus";
import { IRequest } from "../../../../adapters/controllers/base/context/IRequest";
import kernel, { AuthProvider } from "../../../../adapters/providers/container";
import { NextFunction, Request, Response } from "../../../app/core/Modules";
import appMessages from "../../../../application/shared/locals/messages";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import { Middleware } from "../../types";

class SessionMiddleware {
  handle: Middleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (TypeParser.cast<IRequest>(req).isWhiteList) return next();

    const session = TypeParser.cast<IRequest>(req).session;

    if (!session) return SessionMiddleware.authorizationInvalid(next);

    const logoffResult = await TryWrapper.asyncExec(
      kernel
        .get<AuthProvider>(SessionMiddleware.name, AuthProvider.name)
        .hasSessionBeenRevoked(session.sessionId),
    );
    if (logoffResult?.value) return SessionMiddleware.authorizationInvalid(next);

    return next();
  };

  private static getUnauthorized(message: string): ApplicationError {
    return new ApplicationError(SessionMiddleware.name, message, ApplicationStatus.UNAUTHORIZED);
  }

  private static authorizationInvalid(next: NextFunction): void {
    return next(
      SessionMiddleware.getUnauthorized(appMessages.get(appMessages.keys.AUTHORIZATION_REQUIRED)),
    );
  }
}

export default new SessionMiddleware();
