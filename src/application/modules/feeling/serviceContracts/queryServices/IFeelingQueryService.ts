import { ITextFeeling } from "../../../../../domain/textFeeling/TextFeeling.interface";

export interface IFeelingQueryService {
  analyzeText(text: string): Promise<ITextFeeling>;
}
