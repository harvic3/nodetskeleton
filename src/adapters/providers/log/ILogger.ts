import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { EventLog } from "../../../application/shared/log/EventLog";
import { ApplicationError } from "../base/Base.provider";

export interface ILogger {
  info(event: EventLog): void;
  error(error: ErrorLog): void;
  warning(warning: ApplicationError): void;
  message(message: string): void;
}
