import { Nulldefined } from "../../../domain/shared/types/Nulldefined.type";
import { ISession } from "../../../domain/session/ISession";
import { IUser } from "../../../domain/user/IUser";
import { User } from "../../../domain/user/User";

export interface IUserModel {
  getByEmail(email: string | Nulldefined): Promise<User | null>;
  getByAuthentication(email: string, encryptedPassword: string | null): Promise<User | null>;
  create(user: IUser): Promise<User>;
  getBySessionId(sessionId: string): Promise<Partial<ISession> | undefined>;
  registerLogout(session: ISession): Promise<boolean>;
}
