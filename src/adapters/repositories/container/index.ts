import { UserRepository } from "../user/User.repository";
import { IUserModel } from "../user/IUser.model";
import kernel from "../../shared/kernel";

const CONTEXT = "RepositoryContainer";

kernel.addSingleton(
  UserRepository.name,
  new UserRepository(
    kernel.get<IUserModel>(CONTEXT, kernel.classToInterfaceName(UserRepository.name)),
  ),
);

export { UserRepository };
export default kernel;
