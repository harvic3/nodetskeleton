export class EventLog {
  context: string;
  message: string;
  metadata: Record<string, unknown> | undefined;

  constructor(props: { context: string; message: string; metadata?: Record<string, unknown> }) {
    this.context = props.context;
    this.message = props.message;
    this.metadata = props.metadata || undefined;
  }
}
