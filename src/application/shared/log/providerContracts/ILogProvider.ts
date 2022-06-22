import { ApplicationError } from "../../errors/ApplicationError";
import { ErrorLog } from "../ErrorLog";
import { EventLog } from "../EventLog";

export interface ILogProvider {
  logEvent(event: EventLog): Promise<void>;
  logError(error: ErrorLog): Promise<void>;
  logMessage(message: string): Promise<void>;
  logWarning(warning: ApplicationError): Promise<void>;
}
