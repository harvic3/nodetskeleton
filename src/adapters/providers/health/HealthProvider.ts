import { IHealthProvider } from "../../../application/modules/health/providerContracts/IHealthProvider";
import * as moment from "moment";

export class HealthProvider implements IHealthProvider {
  Get(): Promise<string> {
    return new Promise((resolve, rejected) => {
      const message = `<div><h2>Service online at ${moment().format()}</h2></div>`;
      if (!message) {
        rejected(null);
      }
      resolve(message);
    });
  }
}
