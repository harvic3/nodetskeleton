import { DefaultValue } from "../../../../domain/shared/utils/DefaultValue";
import { AppConstants } from "../../../../domain/shared/AppConstants";
import { ApplicationError } from "../../errors/ApplicationError";
import applicationStatus from "../../status/applicationStatus";
import appMessages from "../../locals/messages";
import appWords from "../../locals/words";
import { pbkdf2Sync } from "crypto";

export default class Encryption {
  private static defaultEncryptionKey: string;
  private static defaultEncryptionIterations: number;
  private static defaultEncryptionKeySize: number;

  static init(
    encryptionKey: string,
    encryptionIterations: number,
    encryptionKeySize: number,
  ): void {
    this.defaultEncryptionKey = encryptionKey;
    this.defaultEncryptionIterations = encryptionIterations;
    this.defaultEncryptionKeySize = encryptionKeySize;
  }

  static encrypt(text: string, encryptionKey?: string): string {
    if (!encryptionKey && !this.defaultEncryptionKey) {
      throw new ApplicationError(
        Encryption.name,
        appMessages.getWithParams(appMessages.keys.TOOL_HAS_NOT_BEEN_INITIALIZED, {
          toolName: appWords.get(appWords.keys.ENCRYPTION),
        }),
        applicationStatus.INTERNAL_ERROR,
      );
    }
    const salt = DefaultValue.evaluateAndGet(encryptionKey, this.defaultEncryptionKey);
    return pbkdf2Sync(
      text,
      salt,
      this.defaultEncryptionIterations,
      this.defaultEncryptionKeySize,
      AppConstants.SHA512_ALGORITHM,
    ).toString(AppConstants.BASE64_ENCODING);
  }
}
