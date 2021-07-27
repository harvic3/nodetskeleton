import { BaseProvider } from "../../base/BaseProvider";
import { IDateProvider } from "../../../../application/shared/ports/IDateProvider";
import { DateTime } from "luxon";

export class DateProvider extends BaseProvider implements IDateProvider {
  getDateNow(): string {
    return DateTime.local().toISO();
  }
}
