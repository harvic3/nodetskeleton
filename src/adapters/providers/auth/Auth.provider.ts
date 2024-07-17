import { IAuthProvider } from "../../../application/modules/auth/providerContracts/IAuth.provider";
import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import AppSettings from "../../../application/shared/settings/AppSettings";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { AppConstants } from "../../../domain/shared/AppConstants";
import { IUserModel } from "../../repositories/user/IUser.model";
import { ISession } from "../../../domain/session/ISession";
import { BaseProvider } from "../base/Base.provider";
import { Email } from "../../../domain/user/Email";
import { User } from "../../../domain/user/User";
import { sign, verify } from "jsonwebtoken";

export class AuthProvider extends BaseProvider implements IAuthProvider {
  constructor(
    readonly logProvider: ILogProvider,
    private readonly userModel: IUserModel,
  ) {
    super(logProvider);
  }

  async getJwt(session: ISession): Promise<string> {
    const token = sign(session, AppSettings.JWTEncryptionKey, {
      algorithm: AppConstants.HS512_ALGORITHM,
      expiresIn: AppSettings.JWTExpirationTime,
    });

    return Promise.resolve(token);
  }

  verifyJwt(jwt: string): ISession {
    return verify(jwt, AppSettings.JWTEncryptionKey) as ISession;
  }

  async login(email: string, encryptedPassword: string): Promise<User> {
    const userFound = await this.userModel.getByAuthentication(email, encryptedPassword);
    if (!userFound) return Promise.reject(new Error("User not found"));

    userFound.email = new Email(TypeParser.cast<string>(userFound.email));

    return Promise.resolve(userFound);
  }

  async registerLogout(session: ISession): Promise<boolean> {
    return this.userModel.registerLogout(session);
  }

  async hasSessionBeenRevoked(sessionId: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.userModel
        .getBySessionId(sessionId)
        .then((session) => resolve(!!session))
        .catch((err) => resolve(!!err));
    });
  }
}
