import { ContainerDictionary } from "../../shared/dic/ContainerDictionary";
import { ServiceContainer } from "../../shared/dic/ServiceContainer";
import { UserRepository } from "../user/User.repository";

const dictionary = new ContainerDictionary();
dictionary.addSingleton(UserRepository.name, new UserRepository());

export { UserRepository };
export default new ServiceContainer(dictionary);
