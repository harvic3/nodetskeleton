import { TextFeeling } from "../../../../../domain/textFeeling/TextFeeling";
import { IFeelingQueryService } from "../queryServices/IFeelingQueryService";
import { Sentiment } from "../../../../../domain/sentence/Sentiment";
import { Sentence } from "../../../../../domain/sentence/Sentence";
import { ITextFeelingService } from "./ITextFeelingService";

export default class TextFeelingService implements ITextFeelingService {
  public constructor(private textFeelingQueryService: IFeelingQueryService) {}
  async GetFeelingText(text: string): Promise<TextFeeling> {
    const textFeeling = await this.textFeelingQueryService.AnalyzeText(text);
    return textFeeling;
  }
  async GetSentimentText(text: string): Promise<Sentiment> {
    const textFeeling = await this.textFeelingQueryService.AnalyzeText(text);
    return textFeeling?.GetFeelingText() || null;
  }
  async GetHighestFeelingSentence(text: string): Promise<Sentence> {
    const textFeeling = await this.textFeelingQueryService.AnalyzeText(text);
    return textFeeling?.GetHighestFeelingSentence() || null;
  }
  async GetLowestFeelingSentence(text: string): Promise<Sentence> {
    const textFeeling = await this.textFeelingQueryService.AnalyzeText(text);
    return textFeeling?.GetLowestFeelingSentence() || null;
  }
}
