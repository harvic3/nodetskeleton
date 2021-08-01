import { BaseUseCase, IResultT, IUseCase, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { IHealthProvider } from "../../providerContracts/IHealthProvider";
import DateTimeUtils from "../../../../shared/utils/DateTimeUtils";

export class PongUseCase extends BaseUseCase implements IUseCase<undefined> {
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
