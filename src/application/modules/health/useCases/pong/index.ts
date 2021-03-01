import { BaseUseCase, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { IHealthProvider } from "../../providerContracts/IHealthProvider";

export class PongUseCase extends BaseUseCase {
  constructor(private healthProvider: IHealthProvider) {
    super();
  }

  async execute(): Promise<IResultT<string>> {
    const result = new ResultT<string>();
    const message = await this.healthProvider.get();
    result.setData(message, this.applicationStatusCode.SUCCESS);
    return result;
  }
}
