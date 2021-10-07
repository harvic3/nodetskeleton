import { IWorkerProvider } from "../../../application/shared/worker/IWorkerProvider";
import { WorkerTask } from "../../../application/shared/worker/models/WorkerTask";
import { Worker } from "worker_threads";
import { join } from "path";

export class WorkerProvider implements IWorkerProvider {
  executeTask<ET>(task: WorkerTask): Promise<ET> {
    console.log("Pid Ppal", process.pid);

    return new Promise((resolve, reject) => {
      // const worker = new Worker(join(__dirname, "./runner/index.js"), {
      const worker = new Worker(task.absolutePath, {
        workerData: { task: task },
      });
      worker.on("message", (data: ET) => {
        resolve(data);
      });
      worker.on("error", (error) => {
        reject(error);
      });
      worker.on("exit", (exitCode) => {
        console.log(`It exited with code ${exitCode}`);
      });
    });
  }

  executeDbTask<ET>(task: WorkerTask): Promise<ET> {
    throw new Error("Method not implemented.");
  }
}
