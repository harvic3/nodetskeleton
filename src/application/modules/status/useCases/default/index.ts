import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { IStatusProvider } from "../../providerContracts/IStatus.provider";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";

export class NotFoundUseCase extends BaseUseCase<undefined> {
  constructor(
    readonly logProvider: ILogProvider,
    private readonly healthProvider: IStatusProvider,
  ) {
    super(NotFoundUseCase.name, logProvider);
  }

  async execute(locale: LocaleTypeEnum): Promise<IResult> {
    this.setLocale(locale);
    const result = new Result();

    result.setError(
      this.appMessages.get(this.appMessages.keys.RESOURCE_NOT_FOUND),
      this.applicationStatus.NOT_FOUND,
    );

    return result;
  }
}
