import { ObjectPropertyUtil } from "../../../domain/shared/utils/ObjectPropertyUtil";
import { StringUtil } from "../../../domain/shared/utils/StringUtil";
import { ISession } from "../../../domain/session/ISession";

type Client = {
  ip: string;
  agent: string;
};

type Payload = {
  path?: string;
  httpMethod?: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: any;
};

export class UseCaseTrace {
  readonly startDate: string;
  context: string | undefined;
  client: Client | undefined;
  endDate: string | undefined;
  success: boolean = false;
  payload: Payload | undefined;
  metadata: Record<string, unknown>;
  url: string | undefined;
  statusCode?: number;

  constructor(
    readonly session: ISession,
    startDate: Date,
    readonly origin: string,
    readonly transactionId: string,
  ) {
    this.startDate = startDate.toISOString();
    this.metadata = {};
  }

  toJSON(): Partial<UseCaseTrace> {
    return { ...this };
  }

  setContext(value: string): void {
    if (this.context) {
      this.context = this.context.concat(StringUtil.DOT).concat(value);
    } else {
      this.context = value;
    }
  }

  setClient(client: Client): UseCaseTrace {
    this.client = client;

    return this;
  }

  setRequest(value: Payload): UseCaseTrace {
    if (this.payload) return this;

    this.payload = value;

    return this;
  }

  setHttpStatus(value: number): UseCaseTrace {
    this.statusCode = value;

    return this;
  }

  setArgs(args: unknown, propsToRemove: string[] | undefined): void {
    if (!args) return;

    if (!this.payload) this.payload = { path: undefined, httpMethod: undefined };

    Reflect.set(this.payload, "body", { ...args });
    ObjectPropertyUtil.remove((this.payload as Payload).body, propsToRemove as string[]);
  }

  setSuccessful(): void {
    this.success = true;
  }

  addMetadata(key: string, value: unknown): void {
    this.metadata[key] = value;
  }

  finish(date: Date): void {
    this.endDate = date.toISOString();
  }
}
