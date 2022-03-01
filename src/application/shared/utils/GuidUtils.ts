import { IGuidUtils } from "../../../domain/shared/utilityContracts/IGuidUtil";
import { StringUtils } from "../../../domain/shared/utils/StringUtils";
import { v4 } from "uuid";

export class GuidUtils implements IGuidUtils {
  getV4(): string {
    return v4();
  }
  getV4WithoutDashes(): string {
    return v4().replace(/-/g, StringUtils.EMPTY);
  }
}

export default new GuidUtils();
