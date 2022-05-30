import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { EventLog } from "../../../application/shared/log/EventLog";

export interface ILogger {
  info(event: EventLog): void;
  error(error: ErrorLog): void;
}
