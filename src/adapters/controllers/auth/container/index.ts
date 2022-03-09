import { Container, IContainerDictionary } from "../../../../infrastructure/ioc/Container";
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { authProvider } from "../../../providers/container";

const dictionary: IContainerDictionary = {};
dictionary[LoginUseCase.name] = () => new LoginUseCase(authProvider);

export { LoginUseCase };
export default new Container(dictionary);
