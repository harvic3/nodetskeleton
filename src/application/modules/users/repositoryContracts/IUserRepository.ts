import { IUser } from "../../../../domain/user/IUser";

export interface IUSerRepository {
  getByEmail(email: string): Promise<IUser>;
  register(user: IUser): Promise<IUser>;
}
