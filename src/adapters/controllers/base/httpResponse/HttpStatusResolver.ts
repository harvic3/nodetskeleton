import StatusMapping from "./StatusMapping";

export class HttpStatusResolver {
  private static readonly SUCCESS_CODE: number = 200;

  static getCode(applicationStatusCode: string): number {
    return StatusMapping[applicationStatusCode] || this.SUCCESS_CODE;
  }
}
