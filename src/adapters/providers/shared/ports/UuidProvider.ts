import { BaseProvider } from "../../base/BaseProvider";
import { IUUIDProvider } from "../../../../application/shared/ports/IUUIDProvider";
import { v4 } from "uuid";

export class UuidProvider extends BaseProvider implements IUUIDProvider {
  generateUUID(): string {
    return v4();
  }
}
