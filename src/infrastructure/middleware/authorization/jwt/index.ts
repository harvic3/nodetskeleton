import * as applicationStatus from "../../../../application/shared/status/applicationStatusCodes.json";
import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import resources, { resourceKeys } from "../../../../application/shared/locals";
import { NextFunction, Request, Response } from "../../../server/core/Modules";
import { ISession } from "../../../../domain/session/ISession";
import config from "../../../config";

const TOKEN_PARTS: number = 2;
const TOKEN_VALUE_POSITION: number = 1;
const WHITE_LIST = [`${config.server.Root}/ping`];

class AuthorizationMiddleware {
  async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    const existsUnauthorizedPath: boolean = WHITE_LIST.some((path) => path === req.path);
    if (existsUnauthorizedPath) {
      return next();
    }

    const auth = req.headers.authorization;
    if (!auth) {
      throw new ApplicationError(
        resources.get(resourceKeys.AUTHORIZATION_REQUIRED),
        applicationStatus.UNAUTHORIZED,
      );
    }

    const parts = auth.split(/\s+/);
    if (parts?.length !== TOKEN_PARTS) {
      throw new ApplicationError(
        resources.get(resourceKeys.AUTHORIZATION_REQUIRED),
        applicationStatus.UNAUTHORIZED,
      );
    }

    try {
      const token = parts[TOKEN_VALUE_POSITION];
      // verify your token here with your lib and add necessary logic to set it at the next line
      const session: ISession = { name: "The user name" } as ISession;
      console.log("You maybe need to see the authorization middleware: ", session);
      if (!session) {
        throw new ApplicationError(
          resources.get(resourceKeys.AUTHORIZATION_REQUIRED),
          applicationStatus.UNAUTHORIZED,
        );
      }
      req.session = session;
    } catch (error) {
      throw new ApplicationError(
        resources.get(resourceKeys.AUTHORIZATION_REQUIRED),
        applicationStatus.UNAUTHORIZED,
      );
    }

    return next();
  }
}

export default new AuthorizationMiddleware();
