import { UseCaseTrace } from "../../../application/shared/log/UseCaseTrace";

export interface IUseCaseTraceRepository {
  register(trace: UseCaseTrace): Promise<void>;
}
