import { ISentence } from "./Sentence.interface";
import { Sentiment } from "./Sentiment";

export class Sentence implements ISentence {
  constructor(sentence: string, sentiment: Sentiment) {
    this.sentence = sentence;
    this.sentiment = sentiment;
  }
  sentence: string;
  sentiment: Sentiment;
}
