import { ITextFeeling } from "../../../../../domain/textFeeling/TextFeeling.interface";

export interface IFeelingQueryService {
  AnalyzeText(text: string): Promise<ITextFeeling>;
}
