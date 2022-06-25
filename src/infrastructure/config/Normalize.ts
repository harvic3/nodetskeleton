import { BooleanUtil } from "../../domain/shared/utils/BooleanUtil";
import { join } from "path";
import { type } from "os";

export class Normalize {
  static pathFromOS(path: string): string {
    return BooleanUtil.areEqual(type(), "Windows_NT") ? path.replace(/\\/g, "/") : path;
  }

  static absolutePath(dirName: string, path: string): string {
    return join(dirName, path);
  }
}
