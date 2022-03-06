import { IGuidUtils } from "../../../domain/shared/utilityContracts/IGuidUtil";
import { StringUtil } from "../../../domain/shared/utils/StringUtil";
import { v4 } from "uuid";

export class GuidUtil implements IGuidUtils {
  getV4(): string {
    return v4();
  }

  getV4WithoutDashes(): string {
    return v4().replace(/-/g, StringUtil.EMPTY);
  }
}

export default new GuidUtil();
