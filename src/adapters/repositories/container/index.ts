import { UserRepository } from "../user/User.repository";
import { IUserModel } from "../user/IUser.model";
import kernel from "../../shared/kernel/TSKernel";

const CONTEXT = "RepositoryContainer";

kernel.addSingleton(
  UserRepository.name,
  new UserRepository(kernel.get<IUserModel>(CONTEXT, kernel.classToIName(UserRepository.name))),
);

export { UserRepository as UserRepository };
export default kernel;
