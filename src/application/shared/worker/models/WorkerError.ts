export class WorkerError extends Error {
  name: string = "WorkerError";
  statusCode: string | number;
  messageKey: string;
  constructor(messageKey: string, statusCode: string | number) {
    super(messageKey);
    this.messageKey = messageKey;
    this.statusCode = statusCode;
  }
}
