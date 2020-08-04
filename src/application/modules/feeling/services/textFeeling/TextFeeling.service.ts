import { ITextFeelingService } from "./TextFeeling.service.interface";
import { Sentiment } from "../../../../../domain/sentence/Sentiment";
import { TextFeeling } from "../../../../../domain/textFeeling/TextFeeling";
import { Sentence } from "../../../../../domain/sentence/Sentence";
import { IFeelingQueryService } from "../queryServices/IFeelingQuery.service.interface";

export default class TextFeelingService implements ITextFeelingService {
  public constructor(private textFeelingQueryService: IFeelingQueryService) {}
  async GetFeelingText(text: string): Promise<TextFeeling> {
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    return textFeeling;
  }
  async GetSentimentText(text: string): Promise<Sentiment> {
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    return textFeeling?.GetFeelingText() || null;
  }
  async GetHighestFeelingSentence(text: string): Promise<Sentence> {
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    return textFeeling?.GetHighestFeelingSentence() || null;
  }
  async GetLowestFeelingSentence(text: string): Promise<Sentence> {
    const textFeeling = await this.textFeelingQueryService.AnaliceText(text);
    return textFeeling?.GetLowestFeelingSentence() || null;
  }
}
