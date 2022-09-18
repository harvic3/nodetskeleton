import { Nulldefined } from "../../../../domain/shared/types/Nulldefined.type";
import { IUser } from "../../../../domain/user/IUser";

export interface IUSerRepository {
  getByEmail(email: string | Nulldefined): Promise<IUser | null>;
  register(user: IUser): Promise<IUser>;
}
