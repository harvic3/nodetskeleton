import { Sentiment } from "../sentence/Sentiment";
import { Sentence } from "../sentence/Sentence";

export interface ITextFeeling {
  content: string;
  sentiment: Sentiment;
  sentences: Sentence[];
  GetSentencesNumber(): number;
  GetFeelingText(): Sentiment;
  GetHighestFeelingSentence(): Sentence;
  GetLowestFeelingSentence(): Sentence;
  SetSentiment(sentiment: Sentiment): void;
  SetSentences(sentences: Sentence[]): void;
}
