import { StringUtil } from "../../../../domain/shared/utils/StringUtil";

export class EntriesUtils {
  static toEntries(text: string): Array<string> {
    return text.split(StringUtil.SLASH).filter((i) => !!i);
  }
}
