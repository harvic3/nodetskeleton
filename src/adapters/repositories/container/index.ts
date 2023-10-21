import { UserRepository } from "../user/User.repository";
import { IUserModel } from "../user/IUser.model";
import kernel from "../../shared/kernel";

const CONTEXT = "RepositoryContainer";

export function loadRepositories() {
  kernel.addSingleton(
    UserRepository.name,
    new UserRepository(
      kernel.get<IUserModel>(CONTEXT, kernel.classToInterfaceName(UserRepository.name)),
    ),
  );
}

export { UserRepository };
export default kernel;
