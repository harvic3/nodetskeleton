import { IUserModel as IUserModel } from "../../../adapters/repositories/user/IUser.model";
import GuidUtils from "../../../application/shared/utils/GuidUtils";
import { Nulldifined } from "../../../domain/shared/Nulldifined";
import { IUser } from "../../../domain/user/IUser";
import { User } from "../../../domain/user/User";
import * as dbData from "./db.mock.json";
import mapper from "mapper-tsk";

export class UserModel implements IUserModel {
  async getByEmail(email: string | Nulldifined): Promise<User | null> {
    return new Promise((resolve) => {
      const founded = dbData.users.find((element) => element.email === email);
      if (!founded) {
        return resolve(null);
      }
      const user = mapper.mapObject(founded, new User());
      return resolve(user);
    });
  }

  async getByAuthentication(email: string, encryptedPassword: string | null): Promise<User> {
    return new Promise((resolve, reject) => {
      const founded = dbData.users.find(
        (user) => user.email === email && user.password === encryptedPassword,
      );
      if (!founded) {
        return reject(null);
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
}
