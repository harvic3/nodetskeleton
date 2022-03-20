import { EventLog } from "./EventLog";

export class ErrorLog extends EventLog {
  name: string;
  stack: string | undefined;

  constructor(props: {
    context: string;
    name: string;
    message: string;
    stack?: string;
    metadata?: Record<string, unknown>;
  }) {
    super({
      context: props.context,
      message: props.message,
      metadata: props.metadata,
    });
    this.name = props.name;
    this.stack = props.stack || undefined;
  }

  static fromError(context: string, error: Error): ErrorLog {
    return new ErrorLog({
      context,
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
}
