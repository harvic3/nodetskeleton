import { EntriesUtils } from "./entriesUtils";
import { ICompare } from "./iCompare";
import { PathEvaluation } from "./pathEvaluation";

export class StringCompare implements ICompare {
  private entries: Array<string>;

  constructor(entry: string) {
    this.entries = EntriesUtils.toEntries(entry);
  }
  allowed(pathEvaluation: PathEvaluation): boolean {
    const limit = Math.min(this.entries.length, pathEvaluation.pathEntries.length);
    if (limit === 0) return false;
    for (let i = 0; i < limit; i++) {
      if (this.entries[i] !== pathEvaluation.pathEntries[i]) {
        return false;
      }
    }
    return true;
  }
}
