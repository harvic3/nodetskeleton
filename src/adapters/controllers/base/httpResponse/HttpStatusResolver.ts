import { DefaultValue } from "../../../../domain/shared/utils/DefaultValue";
import StatusMapping from "./StatusMapping";

export class HttpStatusResolver {
  static getCode(applicationStatusCode: string): number {
    return DefaultValue.evaluateAndGet(StatusMapping[applicationStatusCode], StatusMapping.default);
  }
}
