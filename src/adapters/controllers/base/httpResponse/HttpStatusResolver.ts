import { DefaultValue } from "../../../../domain/shared/utils/DefaultValue";
import { HttpStatusEnum } from "./HttpStatusEnum";
import statusMapping from "./statusMapping";

export class HttpStatusResolver {
  static getCode(applicationStatusCode: string): HttpStatusEnum {
    return DefaultValue.evaluateAndGet(statusMapping[applicationStatusCode], statusMapping.default);
  }
}
