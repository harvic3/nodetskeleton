import { BaseUseCase, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { IHealthProvider } from "../../providerContracts/IHealth.provider";
import DateTimeUtils from "../../../../shared/utils/DateTimeUtils";
import AppSettings from "../../../../shared/settings/AppSettings";

export class PongUseCase extends BaseUseCase<undefined> {
  constructor(
    readonly logProvider: ILogProvider,
    private readonly healthProvider: IHealthProvider,
  ) {
    super(PongUseCase.name, logProvider);
  }

  async execute(): Promise<IResultT<string>> {
    const result = new ResultT<string>();

    const message = await this.healthProvider.get(
      AppSettings.ServiceContext,
      DateTimeUtils.getISONow(),
    );
    result.setData(message, this.applicationStatus.SUCCESS);

    return result;
  }
}
