import { IWorkerProvider } from "../../../application/shared/worker/providerContracts/IWorkerProvider";
import { IWorkerError } from "../../../application/shared/worker/models/IWorkerError";
import { WorkerTask } from "../../../application/shared/worker/models/WorkerTask";
import { ApplicationError, BaseProvider } from "../base/Base.provider";
import { TaskDictionary } from "./models/TaskDictionary";
import { Worker } from "worker_threads";

export class WorkerProvider extends BaseProvider implements IWorkerProvider {
  async executeTask<ET>(task: WorkerTask): Promise<ET> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(TaskDictionary[task.taskEnum], {
        workerData: { task },
      });

      worker.on("message", (data: ET | IWorkerError) => {
        if ((data as IWorkerError).statusCode) {
          return reject(
            new ApplicationError(
              WorkerProvider.name,
              (data as IWorkerError).message,
              (data as IWorkerError).statusCode,
            ),
          );
        }
        resolve(data as ET);
      });

      worker.on("error", (error) => {
        reject(
          new ApplicationError(
            WorkerProvider.name,
            error.message,
            this.applicationStatusCode.WORKER_ERROR,
          ),
        );
      });

      worker.on("exit", (exitCode) => {
        if (exitCode !== 0) {
          reject(
            new ApplicationError(
              WorkerProvider.name,
              `Worker exited with code ${exitCode}`,
              this.applicationStatusCode.WORKER_ERROR,
            ),
          );
        }
      });
    });
  }
}
