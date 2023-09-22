import { IStatusProvider } from "../../../application/modules/status/providerContracts/IStatus.provider";
import AppSettings from "../../../application/shared/settings/AppSettings";
import { BaseHttpClient } from "../../shared/httpClient/BaseHttpClient";
import { NumberUtil } from "../../../domain/shared/utils/NumberUtil";

export class HealthProvider implements IStatusProvider {
  constructor(private readonly httpClient: BaseHttpClient) {}

  async get(context: string, date: string): Promise<string> {
    const doRequest = NumberUtil.isEvenNumber(new Date().getTime());

    if (doRequest) {
      const result = await this.httpClient.send<string, string>(
        AppSettings.DefaultHealthRemoteService,
        {
          method: this.httpClient.Methods.GET,
          serializationMethod: this.httpClient.SerializationMethod.TEXT,
        },
      );
      return Promise.resolve(
        `<div><h2>TSkeleton ${context} service context online at ${date} with remote request status ${result.statusCode}</h2></div>`,
      );
    }

    return Promise.resolve(
      `<div><h2>TSkeleton ${context} service context online at ${date}</h2></div>`,
    );
  }
}
