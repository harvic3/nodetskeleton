import { EntriesUtil } from "./entriesUtil";

export class PathEvaluation {
  pathEntries: Array<string> = [];

  constructor(readonly path: string) {
    this.pathEntries = EntriesUtil.toEntries(path);
  }
}
