import { BaseUseCase, IResultT, ResultT } from "../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { IStatusProvider } from "../../providerContracts/IStatus.provider";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import DateTimeUtils from "../../../../shared/utils/DateTimeUtil";
import AppSettings from "../../../../shared/settings/AppSettings";

export class PongUseCase extends BaseUseCase<undefined> {
  constructor(
    readonly logProvider: ILogProvider,
    private readonly healthProvider: IStatusProvider,
  ) {
    super(PongUseCase.name, logProvider);
  }

  async execute(locale: LocaleTypeEnum): Promise<IResultT<string>> {
    this.setLocale(locale);
    const result = new ResultT<string>();

    const message = await this.healthProvider.get(
      AppSettings.ServiceContext,
      DateTimeUtils.getISONow(),
    );
    result.setData(message, this.applicationStatus.SUCCESS);

    return result;
  }
}
