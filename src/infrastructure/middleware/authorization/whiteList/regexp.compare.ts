import { ICompare } from "./iCompare";
import { PathEvaluation } from "./pathEvaluation";

export class RegExpCompare implements ICompare {
  constructor(private entry: RegExp) {}
  allowed(pathEvaluation: PathEvaluation): boolean {
    return this.entry.test(pathEvaluation.path);
  }
}
