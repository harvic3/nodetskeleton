import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { EventLog } from "../../../application/shared/log/EventLog";
import { Logger } from "../../../infrastructure/logger/Logger";

export class LogProvider implements ILogProvider {
  constructor(private readonly logger: Logger) {}

  async logEvent(event: EventLog): Promise<void> {
    return this.logger.info(event);
  }

  async logError(error: ErrorLog): Promise<void> {
    return this.logger.error(error);
  }
}
