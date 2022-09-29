import { ApplicationError } from "../../application/shared/errors/ApplicationError";
import { ErrorLog } from "../../application/shared/log/ErrorLog";
import { EventLog } from "../../application/shared/log/EventLog";
import { ILogger } from "../../adapters/providers/log/ILogger";

export class Logger implements ILogger {
  info(event: EventLog): void {
    console.info(`Debug ${new Date().toISOString()}: ${JSON.stringify(event)}`);
  }

  error(error: ErrorLog): void {
    console.error(`Error ${new Date().toISOString()}: ${JSON.stringify(error)}`);
  }

  message(message: string): void {
    console.log(`Message ${new Date().toISOString()}: ${message}`);
  }

  warning(warning: ApplicationError): void {
    console.warn(
      `Warning ${new Date().toISOString()} ControlledError: ${JSON.stringify(warning.toError())}`,
    );
  }
}
