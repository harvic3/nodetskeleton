import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import resources, { resourceKeys } from "../../../../application/shared/locals/messages";
import applicationStatus from "../../../../application/shared/status/applicationStatus";
import { NextFunction, Request, Response } from "../../../app/core/Modules";
import { authProvider } from "../../../../adapters/providers/container";
import { ISession } from "../../../../domain/session/ISession";
import config from "../../../config";
import { Middleware } from "../..";

const TOKEN_PARTS = 2;
const TOKEN_VALUE_POSITION = 1;
const WHITE_LIST = [
  `${config.Server.Root}/ping`,
  `${config.Server.Root}/v1/users/login`,
  `${config.Server.Root}/v1/users/sign-up`,
];

class AuthorizationMiddleware {
  handle: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    const existsUnauthorizedPath: boolean = WHITE_LIST.some((path) => path === req.path);
    if (existsUnauthorizedPath) {
      return next();
    }

    const auth = req.headers.authorization;
    if (!auth) {
      throw new ApplicationError(
        AuthorizationMiddleware.name,
        resources.get(resourceKeys.AUTHORIZATION_REQUIRED),
        applicationStatus.UNAUTHORIZED,
      );
    }

    const parts = auth.split(/\s+/);
    if (parts?.length !== TOKEN_PARTS) {
      throw new ApplicationError(
        AuthorizationMiddleware.name,
        resources.get(resourceKeys.AUTHORIZATION_REQUIRED),
        applicationStatus.UNAUTHORIZED,
      );
    }

    try {
      const token = parts[TOKEN_VALUE_POSITION];
      const session: ISession = authProvider.verifyJwt(token);
      if (!session) {
        throw new ApplicationError(
          AuthorizationMiddleware.name,
          resources.get(resourceKeys.AUTHORIZATION_REQUIRED),
          applicationStatus.UNAUTHORIZED,
        );
      }
      req.session = session;
    } catch (error) {
      throw new ApplicationError(
        AuthorizationMiddleware.name,
        resources.get(resourceKeys.AUTHORIZATION_REQUIRED),
        applicationStatus.UNAUTHORIZED,
      );
    }

    return next();
  };
}

export default new AuthorizationMiddleware();
