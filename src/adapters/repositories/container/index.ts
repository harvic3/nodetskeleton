import { UserRepository } from "../user/User.repository";
import kernel from "../../shared/kernel";

kernel.addSingleton(UserRepository.name, new UserRepository());

export { UserRepository };
