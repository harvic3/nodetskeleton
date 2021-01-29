import { IHealthProvider } from "../../../application/modules/health/providerContracts/IHealthProvider";
import { DateTime } from "luxon";

export class HealthProvider implements IHealthProvider {
  async Get(): Promise<string> {
    return Promise.resolve(
      `<div><h2>NodeTskeleton online at ${DateTime.local().toISO()}</h2></div>`,
    );
  }
}
