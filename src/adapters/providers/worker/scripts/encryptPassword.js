import BaseWorker from "../../../../application/shared/worker/models/BaseWorker";
import { AppConstants } from "../../../../domain/shared/AppConstants";
import { parentPort, workerData } from "node:worker_threads";
import { pbkdf2Sync } from "node:crypto";

parentPort.postMessage(runTask(workerData.task));

function encrypt(text, encryptionKey, iterations, keyLength = 128) {
  if (!text || !encryptionKey || !iterations) {
    return {
      error: {
        message: BaseWorker.appMessages.getWithParams(
          BaseWorker.appMessages.keys.SOME_PARAMETERS_ARE_MISSING,
          { missingParams: "text, encryptionKey, iterations" },
        ),
        statusCode: BaseWorker.applicationStatus.INTERNAL_ERROR,
      },
      data: null,
    };
  }

  const salt = encryptionKey || this.defaultEncryptionKey;
  return {
    error: null,
    data: pbkdf2Sync(text, salt, iterations, keyLength, AppConstants.SHA512_ALGORITHM).toString(
      AppConstants.BASE64_ENCODING,
    ),
  };
}

function runTask(task) {
  const { text, encryptionKey, iterations } = task.args;
  return encrypt(text, encryptionKey, iterations);
}
