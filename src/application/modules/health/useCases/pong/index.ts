import { BaseUseCase, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { IHealthProvider } from "../../providerContracts/IHealth.provider";
import DateTimeUtils from "../../../../shared/utils/DateTimeUtils";

export class PongUseCase extends BaseUseCase<undefined> {
  constructor(private readonly healthProvider: IHealthProvider) {
    super();
  }

  async execute(): Promise<IResultT<string>> {
    const result = new ResultT<string>();

    const message = await this.healthProvider.get(DateTimeUtils.getISONow());
    result.setData(message, this.applicationStatus.SUCCESS);

    return result;
  }
}
