import { TaskTypeEnum } from "./TaskType.enum";

export class WorkerTask {
  type: TaskTypeEnum;
  absolutePath: string;
  args: { [key: string]: unknown };

  constructor(type: TaskTypeEnum) {
    this.type = type;
  }

  setScriptAbsolutePath(absolutePath: string): void {
    this.absolutePath = absolutePath;
  }

  setArgs(args: { [key: string]: unknown }): void {
    this.args = args;
  }
}
