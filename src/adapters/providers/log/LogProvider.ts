import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { EventLog } from "../../../application/shared/log/EventLog";
import { Logger } from "../../../infrastructure/logger/Logger";

export class LogProvider implements ILogProvider {
  constructor(private readonly log: Logger) {}

  async logEvent(event: EventLog): Promise<void> {
    return this.log.info(event);
  }

  async logError(error: ErrorLog): Promise<void> {
    return this.log.error(error);
  }
}
