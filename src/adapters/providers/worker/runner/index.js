import { parentPort, workerData, isMainThread } from "worker_threads";

parentPort.postMessage(runTask(workerData.task));

function runTask(task) {
  console.log("Pid Secondary", process.pid);
  console.log(task);
  // Do something with task message strategy
  return "success";
}
