import { Nulldifined } from "../../../domain/shared/Nulldifined";
import { IUser } from "../../../domain/user/IUser";
import { User } from "../../../domain/user/User";

export interface IUserModel {
  getByEmail(email: string | Nulldifined): Promise<User | null>;
  getByAuthentication(email: string, encryptedPassword: string | null): Promise<User>;
  create(user: IUser): Promise<User>;
}
