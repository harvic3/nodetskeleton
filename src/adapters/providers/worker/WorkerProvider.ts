import { IWorkerProvider } from "../../../application/shared/worker/IWorkerProvider";
import { WorkerTask } from "../../../application/shared/worker/models/WorkerTask";
import { BaseProvider, IResult } from "../base/BaseProvider";
import { Worker } from "worker_threads";

export class WorkerProvider extends BaseProvider implements IWorkerProvider {
  executeTask<ET>(result: IResult, task: WorkerTask): Promise<ET> {
    console.time("worker");

    return new Promise((resolve, reject) => {
      const worker = new Worker(task.absolutePath, {
        workerData: { task: task },
      });
      worker.on("message", (data: ET) => {
        console.timeEnd("worker");
        resolve(data);
      });
      worker.on("error", (error: Error) => {
        if (error.name === "WorkerError") {

        }
        reject(error);
      });
      worker.on("exit", (exitCode) => {
        console.log(`Worker exited with code ${exitCode}`);
      });
    });
  }
}
