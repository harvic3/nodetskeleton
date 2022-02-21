import { IUser } from "../../../../domain/user/IUser";

export interface IUSerRepository {
  getByEmail(email: string | undefined): Promise<IUser | null>;
  register(user: IUser): Promise<IUser>;
}
