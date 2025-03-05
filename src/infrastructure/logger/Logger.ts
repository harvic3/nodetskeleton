import { ApplicationError } from "../../application/shared/errors/ApplicationError";
import { ErrorLog } from "../../application/shared/log/ErrorLog";
import { EventLog } from "../../application/shared/log/EventLog";
import { ILogger } from "../../adapters/providers/log/ILogger";

export class Logger implements ILogger {
  info(event: EventLog): void {
    console.info(`[INFO]: ${new Date().toISOString()}: ${JSON.stringify(event)}`);
  }

  error(error: ErrorLog | ApplicationError): void {
    console.error(`[ERROR]: ${new Date().toISOString()}: ${JSON.stringify(error)}`);
  }

  message(message: string): void {
    console.log(`[MESSAGE]: ${new Date().toISOString()}: ${message}`);
  }

  warning(warning: ApplicationError): void {
    console.warn(
      `[WARNING]: ${new Date().toISOString()} ControlledError: ${JSON.stringify(warning.toError())}`,
    );
  }
}
