import { IWorkerError } from "../../../application/shared/worker/models/IWorkerError";
import { IWorkerProvider } from "../../../application/shared/worker/IWorkerProvider";
import { WorkerTask } from "../../../application/shared/worker/models/WorkerTask";
import { BaseProvider, IResult } from "../base/BaseProvider";
import { Worker } from "worker_threads";

export class WorkerProvider extends BaseProvider implements IWorkerProvider {
  executeTask<ET>(result: IResult, task: WorkerTask): Promise<ET> {
    console.log("Provider trace");
    console.time("worker");

    return new Promise((resolve, reject) => {
      const worker = new Worker(task.absolutePath, {
        workerData: { task: task },
      });
      worker.on("message", (data: ET | IWorkerError) => {
        console.log("Worker message");
        console.timeEnd("worker");
        if ((data as IWorkerError).statusCode) {
          result.setError((data as IWorkerError).message, (data as IWorkerError).statusCode);
        }
        resolve(data as ET);
      });
      worker.on("error", (error) => {
        console.log("Worker error");
        result.setError(error.message, this.applicationStatusCode.INTERNAL_ERROR);
        reject(result);
      });
      worker.on("exit", (exitCode) => {
        console.log(`Worker exited with code ${exitCode}`);
      });
    });
  }
}
