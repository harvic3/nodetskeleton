import { TaskDictionaryEnum } from "./TaskDictionary.enum";

export class WorkerTask {
  taskEnum: TaskDictionaryEnum;
  args: Record<string, unknown> | undefined;

  constructor(taskEnum: TaskDictionaryEnum) {
    this.taskEnum = taskEnum;
  }

  setArgs(args: Record<string, unknown>): void {
    this.args = args;
  }
}
