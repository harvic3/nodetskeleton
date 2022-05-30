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
  constructor(readonly logProvider: ILogProvider, private readonly userModel: IUserModel) {
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
    const founded = await this.userModel.getByAuthentication(email, encryptedPassword);
    if (!founded) return Promise.reject();

    founded.email = new Email(TypeParser.cast<string>(founded.email));

    return Promise.resolve(founded);
  }
}
