import { pbkdf2Sync } from "crypto";
import { ApplicationError } from "../../errors/ApplicationError";

const ALGORITHM = "sha512";
const FORMAT = "base64";

export default class Encryptor {
  private static defaultEncryptionKey: string;

  static init(encryptionKey: string): void {
    this.defaultEncryptionKey = encryptionKey;
  }

  static encrypt(text: string, encryptionKey?: string): string {
    if (!encryptionKey && !this.defaultEncryptionKey) {
      throw new ApplicationError("", "");
    }
    const salt = encryptionKey || this.defaultEncryptionKey;
    return pbkdf2Sync(text, salt, 1e4, 64, ALGORITHM).toString(FORMAT);
  }
}
