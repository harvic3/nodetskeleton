import { BaseUseCase, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { IHealthProvider } from "../../providerContracts/IHealthProvider";

export class PongUseCase extends BaseUseCase {
  constructor(private healthProvider: IHealthProvider) {
    super();
  }

  async Execute(): Promise<IResultT<string>> {
    const result = new ResultT<string>();
    const message = await this.healthProvider.Get();
    result.SetData(message, this.resultCodes.SUCCESS);
    return result;
  }
}
