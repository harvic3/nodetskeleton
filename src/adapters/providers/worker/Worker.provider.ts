import { IWorkerProvider } from "../../../application/shared/worker/providerContracts/IWorkerProvider";
import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import { IWorkerError } from "../../../application/shared/worker/models/IWorkerError";
import { WorkerTask } from "../../../application/shared/worker/models/WorkerTask";
import { ApplicationError, BaseProvider, Result } from "../base/Base.provider";
import { TaskDictionary } from "./models/TaskDictionary";
import { Worker } from "worker_threads";

export class WorkerProvider extends BaseProvider implements IWorkerProvider {
  constructor(logProvider: ILogProvider) {
    super(logProvider);
  }

  async executeTask<ET>(task: WorkerTask): Promise<ET> {
    const agent = new Result();
    const taskResult = await new Promise((resolve, reject) => {
      const worker = new Worker(TaskDictionary[task.taskEnum], {
        workerData: { task: task },
      });
      worker.on("message", (data: ET | IWorkerError) => {
        if ((data as IWorkerError).statusCode) {
          agent.setError((data as IWorkerError).message, (data as IWorkerError).statusCode);
        }
        resolve(data as ET);
      });
      worker.on("error", (error) => {
        agent.setError(error.message, this.applicationStatusCode.WORKER_ERROR);
        reject(error);
      });
      worker.on("exit", (exitCode) => {
        console.log(`Worker in task ${task.taskEnum} exited with code ${exitCode}`);
      });
    });

    if (agent.error)
      throw new ApplicationError(WorkerProvider.name, agent.message, agent.statusCode);

    return Promise.resolve(taskResult as ET);
  }
}
