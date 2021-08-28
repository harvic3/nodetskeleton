import { IAuthProvider } from "../../../application/modules/auth/providerContracts/IAuth.provider";
import userModel from "../../../infrastructure/dataBases/nodeTsKeleton/User.model";
import Encryptor from "../../../application/shared/security/encryption/Encryptor";
import AppSettings from "../../../application/shared/settings/AppSettings";
import { ISession } from "../../../domain/session/ISession";
import { BaseProvider } from "../base/BaseProvider";
import { User } from "../../../domain/user/User";
import { sign, verify } from "jsonwebtoken";

export class AuthProvider extends BaseProvider implements IAuthProvider {
  async getJwt(session: ISession): Promise<string> {
    const token = sign(session, AppSettings.JWTEncryptionKey, {
      algorithm: "HS512",
      expiresIn: AppSettings.JWTExpirationTime,
    });
    return Promise.resolve(token);
  }

  async verifyJwt(jwt: string): Promise<ISession> {
    const session: ISession = verify(jwt, AppSettings.JWTEncryptionKey) as ISession;
    return Promise.resolve(session);
  }

  async login(email: string, passwordB64: string): Promise<User> {
    const encryptedPassword = Encryptor.encrypt(`${email.toLowerCase()}-${passwordB64}`);
    return userModel.getByAuthentication(encryptedPassword);
  }
}
