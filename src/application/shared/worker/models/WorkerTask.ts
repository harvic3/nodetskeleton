import { TaskDictionaryEnum } from "./TaskDictionary.enum";

export class WorkerTask {
  taskEnum: TaskDictionaryEnum;
  args: { [key: string]: unknown };

  constructor(taskEnum: TaskDictionaryEnum) {
    this.taskEnum = taskEnum;
  }

  setArgs(args: { [key: string]: unknown }): void {
    this.args = args;
  }
}
