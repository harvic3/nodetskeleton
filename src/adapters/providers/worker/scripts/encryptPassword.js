import { WorkerError } from "../../../../application/shared/worker/models/WorkerError";
import resourcesKeys from "../../../../application/shared/locals/messages/keys";
import { AppConstants } from "../../../../domain/shared/AppConstants";
import { parentPort, workerData } from "worker_threads";
import { pbkdf2Sync } from "crypto";

parentPort.postMessage(runTask(workerData.task));

function encrypt(text, encryptionKey, iterations, keyLength = 128) {
  if (!encryptionKey || !iterations) {
    // throw new WorkerError("SOMETHING_WENT_WRONG", "50");
    throw new WorkerError(resourcesKeys.SOMETHING_WENT_WRONG, "50");
  }
  const salt = encryptionKey || this.defaultEncryptionKey;
  return pbkdf2Sync(text, salt, iterations, keyLength, AppConstants.SHA512_ALGORITHM).toString(
    AppConstants.BASE64_ENCODING,
  );
}

function runTask(task) {
  const { text, encryptionKey, iterations } = task.args;
  return encrypt(text, encryptionKey, iterations);
}
