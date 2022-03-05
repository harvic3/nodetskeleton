import { IAuthProvider } from "../../../application/modules/auth/providerContracts/IAuth.provider";
import userModel from "../../../infrastructure/dataBases/nodeTsKeleton/User.model";
import AppSettings from "../../../application/shared/settings/AppSettings";
import Encryption from "../../../application/shared/security/encryption";
import { AppConstants } from "../../../domain/shared/AppConstants";
import { ISession } from "../../../domain/session/ISession";
import { BaseProvider } from "../base/BaseProvider";
import { User } from "../../../domain/user/User";
import { sign, verify } from "jsonwebtoken";

export class AuthProvider extends BaseProvider implements IAuthProvider {
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

  async login(email: string, passwordB64: string): Promise<User> {
    const encryptedPassword = Encryption.encrypt(`${email.toLowerCase()}-${passwordB64}`);
    return userModel.getByAuthentication(encryptedPassword);
  }
}
