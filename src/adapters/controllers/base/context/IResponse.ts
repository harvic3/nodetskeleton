import { UseCaseTrace } from "../../../../application/shared/log/UseCaseTrace";

export interface IResponse {
  trace: UseCaseTrace;
  statusCode: number;
  status(code: number): IResponse;
  send(body: unknown): IResponse;
  json(body: unknown): IResponse;
  setHeader(name: string, value: number | string): this;
}
