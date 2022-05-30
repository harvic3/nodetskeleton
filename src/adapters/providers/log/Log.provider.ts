import { ILogProvider } from "../../../application/shared/log/providerContracts/ILogProvider";
import { ErrorLog } from "../../../application/shared/log/ErrorLog";
import { EventLog } from "../../../application/shared/log/EventLog";
import { ILogger } from "./ILogger";

export class LogProvider implements ILogProvider {
  constructor(private readonly logger: ILogger) {}

  async logEvent(event: EventLog): Promise<void> {
    return this.logger.info(event);
  }

  async logError(error: ErrorLog): Promise<void> {
    return this.logger.error(error);
  }
}
