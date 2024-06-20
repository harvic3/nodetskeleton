import { PathEvaluation } from "./pathEvaluation";

export interface ICompare {
  allowed(pathEvaluation: PathEvaluation): boolean;
}
