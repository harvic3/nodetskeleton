import { Sentiment } from "../../../../domain/sentence/Sentiment";
import { Sentence } from "../../../../domain/sentence/Sentence";

export class TextFeelingDto {
  content: string = null;
  sentiment: Sentiment = null;
  sentences: Sentence[] = [];
}
