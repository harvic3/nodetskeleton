import { IHealthProvider } from "../../../application/modules/health/providerContracts/IHealth.provider";

export class HealthProvider implements IHealthProvider {
  async get(context: string, date: string): Promise<string> {
    return Promise.resolve(
      `<div><h2>NodeTSkeleton ${context} service context online at ${date}</h2></div>`,
    );
  }
}
