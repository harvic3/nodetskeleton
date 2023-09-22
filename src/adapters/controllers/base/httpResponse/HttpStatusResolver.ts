import { DefaultValue } from "../../../../domain/shared/utils/DefaultValue";
import { HttpStatusEnum } from "./HttpStatusEnum";
import statusMapping from "./AppStatusMapping";

export class HttpStatusResolver {
  static getCode(applicationStatusCode: string): HttpStatusEnum {
    return DefaultValue.evaluateAndGet(statusMapping[applicationStatusCode], statusMapping.default);
  }
}
