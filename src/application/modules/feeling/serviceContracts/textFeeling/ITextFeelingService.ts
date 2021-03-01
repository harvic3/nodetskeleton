import { Sentiment } from "../../../../../domain/sentence/Sentiment";
import { Sentence } from "../../../../../domain/sentence/Sentence";
import { ITextFeeling } from "../../../../../domain/textFeeling/TextFeeling.interface";

export interface ITextFeelingService {
  getFeelingText(text: string): Promise<ITextFeeling>;
  GetSentimentText(text: string): Promise<Sentiment>;
  getHighestFeelingSentence(text: string): Promise<Sentence>;
  getLowestFeelingSentence(text: string): Promise<Sentence>;
}
