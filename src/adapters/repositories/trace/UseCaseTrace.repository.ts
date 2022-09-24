import { UseCaseTrace } from "../../../application/shared/log/UseCaseTrace";
import { IUseCaseTraceRepository } from "./IUseCaseTrace.repository";
import { BaseRepository } from "../base/Base.repository";

export class UseCaseTraceRepository extends BaseRepository implements IUseCaseTraceRepository {
  async register(trace: UseCaseTrace): Promise<void> {
    // TODO: implement this repository method
    console.log(JSON.stringify(trace.toJSON()));
    return Promise.resolve();
  }
}
