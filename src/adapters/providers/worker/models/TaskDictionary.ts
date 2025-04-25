import { join } from "path";

export class TaskDictionary {
  static readonly ENCRYPT_PASSWORD = join(__dirname, "../scripts/encryptPassword.js");
}
