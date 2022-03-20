import { ErrorLog } from "../../../shared/log/ErrorLog";
import { EventLog } from "../../../shared/log/EventLog";

export interface ILogProvider {
  logEvent(event: EventLog): Promise<void>;
  logError(error: ErrorLog): Promise<void>;
}
