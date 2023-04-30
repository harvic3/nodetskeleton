import { LocaleTypeEnum } from "../../../../application/shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../../application/shared/log/UseCaseTrace";
import { ISession } from "../../../../domain/session/ISession";

type IRequest = {
  query: NodeJS.Dict<string | string[]>;
  body?: any;
  headers: NodeJS.Dict<string | string[]>;
  get(field: string): string;
};

type IResponse = {
  status: number;
  body: unknown;
  headerSent: boolean;
  set(field: { [key: string]: string | string[] }): void;
  set(field: string, val: string | string[]): void;
};

type App = {
  emit(event: string, err: unknown, ctx: IContext): boolean;
};

export interface IContext {
  isWhiteList: boolean;
  session: ISession;
  request: IRequest;
  response: IResponse;
  status: number;
  body: unknown;
  locale: LocaleTypeEnum;
  trace: UseCaseTrace;
  ipAddress: string;
  userAgent: string;
  clientIP: string;
  app: App;
}
