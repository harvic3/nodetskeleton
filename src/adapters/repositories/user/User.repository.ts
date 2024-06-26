import { IUserRepository } from "../../../application/modules/users/providerContracts/IUser.repository";
import { Nulldefined } from "../../../domain/shared/types/Nulldefined.type";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { BaseRepository } from "../base/Base.repository";
import { IUser } from "../../../domain/user/IUser";
import { Email } from "../../../domain/user/Email";
import { User } from "../../../domain/user/User";
import { IUserModel } from "./IUser.model";

export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(private readonly userModel: IUserModel) {
    super();
  }

  async getByEmail(email: string | Nulldefined): Promise<IUser | null> {
    const founded = await this.userModel.getByEmail(email);
    if (!founded) return Promise.resolve(null);

    founded.email = new Email(TypeParser.cast<string>(founded.email));
    return Promise.resolve(founded);
  }

  async register(user: User): Promise<IUser> {
    const userData = { ...user } as IUser;
    userData.email = user.email?.value as string;

    const created = await this.userModel.create(userData);
    return Promise.resolve(created);
  }
}
