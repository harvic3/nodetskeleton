export interface IDateTimeUtil {
  getISONow(): string;
  getCurrentDate(): Date;
  getCurrentTime(): string;
  toDateTMZ(timeStamp: number): Date;
}
