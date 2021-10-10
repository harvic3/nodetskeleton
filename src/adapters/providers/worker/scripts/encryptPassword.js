import BaseWorker from "../../../../application/shared/worker/models/BaseWorker";
import { AppConstants } from "../../../../domain/shared/AppConstants";
import { parentPort, workerData } from "worker_threads";
import { pbkdf2Sync } from "crypto";

parentPort.postMessage(runTask(workerData.task));

function encrypt(text, encryptionKey, iterations, keyLength = 128) {
  console.log("Executing function");
  if (!encryptionKey || !iterations) {
    return {
      message: BaseWorker.resources.getWithParams(
        BaseWorker.resourceKeys.SOME_PARAMETERS_ARE_MISSING,
        { missingParams: "encryptionKey, iterations" },
      ),
      statusCode: BaseWorker.applicationStatus.INTERNAL_ERROR,
    };
  }
  const salt = encryptionKey || this.defaultEncryptionKey;
  return pbkdf2Sync(text, salt, iterations, keyLength, AppConstants.SHA512_ALGORITHM).toString(
    AppConstants.BASE64_ENCODING,
  );
}

function runTask(task) {
  console.log("Task execution");
  const { text, encryptionKey, iterations } = task.args;
  return encrypt(text, encryptionKey, iterations);
}
