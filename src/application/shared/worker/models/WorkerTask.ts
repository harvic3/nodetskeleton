export class WorkerTask {
  absolutePath: string;
  args: { [key: string]: unknown };

  constructor(absoluteScriptPath: string) {
    this.absolutePath = absoluteScriptPath;
  }

  setArgs(args: { [key: string]: unknown }): void {
    this.args = args;
  }
}
