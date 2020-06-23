export interface IResult {
  statusCode: number;
  success: boolean;
  message: string;
  SetStatusCode(statusCode: number): void;
  SetMessage(message: string): void;
  Successful(): void;
  Successful(message: string, statusCode?: number): void;
  SetError(message: string, statusCode?: number): void;
}
