import { BaseUseCase, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { IHealthProvider } from "../../providerContracts/IHealthProvider";
import { DateTime } from "luxon";

export class PongUseCase extends BaseUseCase {
  constructor(private readonly healthProvider: IHealthProvider) {
    super();
  }

  async execute(): Promise<IResultT<string>> {
    const result = new ResultT<string>();
    const message = await this.healthProvider.get(DateTime.local().toISO());
    result.setData(message, this.applicationStatus.SUCCESS);
    return result;
  }
}
