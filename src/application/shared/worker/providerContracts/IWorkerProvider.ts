import { WorkerTask } from "../models/WorkerTask";

export interface IWorkerProvider {
  executeTask<ET>(task: WorkerTask): Promise<ET>;
}
