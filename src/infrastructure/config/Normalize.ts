import { join } from "path";
import { type } from "os";

export class Normalize {
  static pathToSO(path: string): string {
    return type() === "Windows_NT" ? path.replace(/\\/g, "/") : path;
  }

  static absolutePath(dirName: string, path: string): string {
    return join(dirName, path);
  }
}
