import StatusMapping from "./StatusMapping";

export class HttpStatusResolver {
  private static readonly DEFAULT_STATUS_CODE: number = 500;

  static getCode(applicationStatusCode: string): number {
    return StatusMapping[applicationStatusCode] || this.DEFAULT_STATUS_CODE;
  }
}
