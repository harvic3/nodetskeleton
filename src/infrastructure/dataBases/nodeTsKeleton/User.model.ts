import { IUserModel } from "../../../adapters/repositories/user/IUser.model";
import { Nulldefined } from "../../../domain/shared/types/Nulldefined.type";
import DateTimeUtils from "../../../application/shared/utils/DateTimeUtil";
import { BooleanUtil } from "../../../domain/shared/utils/BooleanUtil";
import GuidUtils from "../../../application/shared/utils/GuidUtil";
import { ISession } from "../../../domain/session/ISession";
import { IUser } from "../../../domain/user/IUser";
import { User } from "../../../domain/user/User";
import * as dbData from "./db.mock.json";
import mapper from "mapper-tsk";

export class UserModel implements IUserModel {
  async getByEmail(email: string | Nulldefined): Promise<User | null> {
    return new Promise((resolve) => {
      const founded = dbData.users.find((element) => BooleanUtil.areEqual(element.email, email));
      if (!founded) {
        return resolve(null);
      }
      const user = mapper.mapObject(founded, new User());
      return resolve(user);
    });
  }

  async getByAuthentication(email: string, encryptedPassword: string | null): Promise<User | null> {
    return new Promise((resolve) => {
      const founded = dbData.users.find(
        (user) =>
          BooleanUtil.areEqual(user.email, email) &&
          BooleanUtil.areEqual(user.password, encryptedPassword),
      );
      if (!founded) {
        return resolve(null);
      }
      const domainUser = mapper.mapObject(founded, new User());
      return resolve(domainUser);
    });
  }

  async create(user: IUser): Promise<User> {
    user.uid = GuidUtils.getV4();
    return new Promise((resolve) => {
      dbData.users.push(user as any);
      return resolve(user as User);
    });
  }

  private removeSessionLogout(sessionId: string) {
    const index = dbData.logoff.findIndex((session) =>
      BooleanUtil.areEqual(session.sessionId, sessionId),
    );
    if (index > -1) {
      dbData.logoff.splice(index, 1);
    }
  }

  async registerLogout(session: ISession): Promise<boolean> {
    return new Promise((resolve) => {
      const { exp, sessionId } = session;
      const expireAt = DateTimeUtils.toDateTMZ(exp);
      const timeout = expireAt.getTime() - new Date().getTime();
      setTimeout(() => this.removeSessionLogout(sessionId), timeout);
      dbData.logoff.push({ expireAt, sessionId } as any);
      return resolve(true);
    });
  }

  async getBySessionId(sessionId: string): Promise<Partial<ISession> | undefined> {
    return new Promise((resolve) => {
      const sessionFound = dbData.logoff.find((session) =>
        BooleanUtil.areEqual(session.sessionId, sessionId),
      );
      return resolve(sessionFound);
    });
  }
}
