import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import resources, { resourceKeys } from "../../../../application/shared/locals/messages";
import applicationStatus from "../../../../application/shared/status/applicationStatus";
import { NextFunction, Request, Response } from "../../../app/core/Modules";
import { authProvider } from "../../../../adapters/providers/container";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import { ISession } from "../../../../domain/session/ISession";
import { Middleware } from "../..";

const TOKEN_PARTS = 2;
const TOKEN_VALUE_POSITION = 1;

class AuthorizationMiddleware {
  handle: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isWhiteList) return next();

    const auth = req.headers.authorization;

    if (!auth) this.throwUnauthorized();

    const parts = auth?.split(/\s+/) as string[];
    if (parts?.length !== TOKEN_PARTS) this.throwUnauthorized();

    try {
      const token = parts[TOKEN_VALUE_POSITION];
      const session = TryWrapper.exec(authProvider.verifyJwt, [token]);
      if (!session) this.throwUnauthorized();
      req.session = TypeParser.parse<ISession>(session);
    } catch (error) {
      return next(error);
    }

    return next();
  };

  private throwUnauthorized(): void {
    throw new ApplicationError(
      AuthorizationMiddleware.name,
      resources.get(resourceKeys.AUTHORIZATION_REQUIRED),
      applicationStatus.UNAUTHORIZED,
    );
  }
}

export default new AuthorizationMiddleware();
