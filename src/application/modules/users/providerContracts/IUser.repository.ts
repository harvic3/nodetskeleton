import { Nulldifined } from "../../../../domain/shared/Nulldifined";
import { IUser } from "../../../../domain/user/IUser";

export interface IUSerRepository {
  getByEmail(email: string | Nulldifined): Promise<IUser | null>;
  register(user: IUser): Promise<IUser>;
}
