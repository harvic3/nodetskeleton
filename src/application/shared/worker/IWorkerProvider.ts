import { IResult } from "../useCase/BaseUseCase";
import { WorkerTask } from "./models/WorkerTask";

export interface IWorkerProvider {
  executeTask<ET>(result: IResult, task: WorkerTask): Promise<ET>;
}
