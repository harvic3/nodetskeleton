import { ApplicationError } from "../../errors/ApplicationError";
import resources, { resourceKeys } from "../../locals/messages";
import applicationStatus from "../../status/applicationStatus";
import words, { wordKeys } from "../../locals/words";
import { pbkdf2Sync } from "crypto";

const ALGORITHM = "sha512";
const FORMAT = "base64";

export default class Encryptor {
  private static defaultEncryptionKey: string;

  static init(encryptionKey: string): void {
    this.defaultEncryptionKey = encryptionKey;
  }

  static encrypt(text: string, encryptionKey?: string): string {
    if (!encryptionKey && !this.defaultEncryptionKey) {
      throw new ApplicationError(
        resources.getWithParams(resourceKeys.TOOL_HAS_NOT_BEEN_INITIALIZED, {
          toolName: words.get(wordKeys.ENCRYPTOR),
        }),
        applicationStatus.INTERNAL_ERROR,
      );
    }
    const salt = encryptionKey || this.defaultEncryptionKey;
    return pbkdf2Sync(text, salt, 1e4, 64, ALGORITHM).toString(FORMAT);
  }
}
