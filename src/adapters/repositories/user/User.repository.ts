import { IUSerRepository } from "../../../application/modules/users/providerContracts/IUser.repository";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { Nulldifined } from "../../../domain/shared/Nulldifined";
import { BaseRepository } from "../base/Base.repository";
import { IUser } from "../../../domain/user/IUser";
import { Email } from "../../../domain/user/Email";
import { User } from "../../../domain/user/User";
import { IUserModel } from "./IUser.model";

export class UserRepository extends BaseRepository implements IUSerRepository {
  constructor(private readonly userModel: IUserModel) {
    super();
  }

  async getByEmail(email: string | Nulldifined): Promise<IUser | null> {
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
