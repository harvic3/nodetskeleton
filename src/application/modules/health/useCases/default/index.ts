import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { IHealthProvider } from "../../providerContracts/IHealth.provider";

export class NotFoundUseCase extends BaseUseCase<undefined> {
  constructor(
    readonly logProvider: ILogProvider,
    private readonly healthProvider: IHealthProvider,
  ) {
    super(NotFoundUseCase.name, logProvider);
  }

  async execute(): Promise<IResult> {
    const result = new Result();

    result.setError(
      this.appMessages.get(this.appMessages.keys.RESOURCE_NOT_FOUND),
      this.applicationStatus.NOT_FOUND,
    );

    return result;
  }
}
