import { DefaultValue } from "../../../../domain/shared/utils/DefaultValue";
import { ApplicationStatus } from "../Base.controller";
import { HttpStatusEnum } from "./HttpStatusEnum";
import statusMapping from "./AppStatusMapping";

export class HttpStatusResolver {
  static getCode(applicationStatusCode: ApplicationStatus): HttpStatusEnum {
    return DefaultValue.evaluateAndGet(statusMapping[applicationStatusCode], statusMapping.DEFAULT);
  }
}
