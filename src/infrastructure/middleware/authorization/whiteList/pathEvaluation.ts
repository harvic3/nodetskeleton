import { EntriesUtils } from "./entriesUtils";

export class PathEvaluation {
  pathEntries: Array<string> = [];

  constructor(readonly path: string) {
    this.pathEntries = EntriesUtils.toEntries(path);
  }
}
