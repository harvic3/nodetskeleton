import { ISession } from "../../../../domain/session/ISession";
import { User } from "../../../../domain/user/User";

export interface IAuthProvider {
  login(email: string, passwordB64: string): Promise<User>;
  getJwt(session: ISession): Promise<string>;
  verifyJwt(jwt: string): ISession;
}
