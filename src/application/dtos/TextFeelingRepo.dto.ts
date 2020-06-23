import { SentimentDto } from "./Sentiment.dto";
import { SentenceDto } from "./Setence.dto";

export class TextFeelinRepoDto {
  result: SentimentDto;
  sentences: SentenceDto[];
}