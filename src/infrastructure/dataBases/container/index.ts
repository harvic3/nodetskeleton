import { UserRepository } from "../../../adapters/repositories/container";
import { UserModel } from "../nodeTsKeleton/User.model";
import tsKernel from "../../../adapters/shared/kernel";

export function LoadTSKDBModels() {
  // Register all DataBase models here.
  tsKernel.addSingleton(tsKernel.classToInterfaceName(UserRepository.name), new UserModel());
}
