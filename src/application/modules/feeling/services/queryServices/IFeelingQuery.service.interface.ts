import { ITextFeeling } from "../../../../../domain/textFeeling/TextFeeling.interface";

export interface IFeelingQueryService {
  AnaliceText(text: string): Promise<ITextFeeling>;
}
