import { TextFeeling } from "../../../../../domain/textFeeling/TextFeeling";
import { IFeelingQueryService } from "../queryServices/IFeelingQueryService";
import { Sentiment } from "../../../../../domain/sentence/Sentiment";
import { Sentence } from "../../../../../domain/sentence/Sentence";
import { ITextFeelingService } from "./ITextFeelingService";

export default class TextFeelingService implements ITextFeelingService {
  public constructor(private textFeelingQueryService: IFeelingQueryService) {}
  async getFeelingText(text: string): Promise<TextFeeling> {
    const textFeeling = await this.textFeelingQueryService.analyzeText(text);
    return textFeeling;
  }
  async GetSentimentText(text: string): Promise<Sentiment> {
    const textFeeling = await this.textFeelingQueryService.analyzeText(text);
    return textFeeling?.GetFeelingText() || null;
  }
  async getHighestFeelingSentence(text: string): Promise<Sentence> {
    const textFeeling = await this.textFeelingQueryService.analyzeText(text);
    return textFeeling?.GetHighestFeelingSentence() || null;
  }
  async getLowestFeelingSentence(text: string): Promise<Sentence> {
    const textFeeling = await this.textFeelingQueryService.analyzeText(text);
    return textFeeling?.GetLowestFeelingSentence() || null;
  }
}
