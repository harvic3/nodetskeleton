export interface IResponse {
  status(code: number): IResponse;
  send(body: unknown): IResponse;
  json(body: unknown): IResponse;
}
