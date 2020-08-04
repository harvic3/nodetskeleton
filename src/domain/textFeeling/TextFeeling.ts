import { ITextFeeling } from "./TextFeeling.interface";
import { Sentiment } from "../sentence/Sentiment";
import { Sentence } from "../sentence/Sentence";

export class TextFeeling implements ITextFeeling {
  constructor(content: string) {
    this.content = content;
    this.sentences = [];
  }
  content: string;
  sentiment: Sentiment;
  sentences: Sentence[];
  GetSentencesNumber(): number {
    return this.sentences.length;
  }
  GetFeelingText(): Sentiment {
    return this.sentiment;
  }
  GetHighestFeelingSentence(): Sentence {
    if (this.sentences.length == 0) return null;
    const highest = this.sentences.reduce((sentence, evaluate) => {
      return evaluate.sentiment.polarity > sentence.sentiment.polarity ? evaluate : sentence;
    });
    return highest;
  }
  GetLowestFeelingSentence(): Sentence {
    if (this.sentences.length == 0) return null;
    const lowest = this.sentences.reduce((sentence, evaluate) => {
      return evaluate.sentiment.polarity < sentence.sentiment.polarity ? evaluate : sentence;
    });
    return lowest;
  }
  SetSentiment(sentiment: Sentiment): void {
    if (sentiment) {
      this.sentiment = sentiment;
    }
  }
  SetSentences(sentences: Sentence[]): void {
    if (sentences.length > 0) {
      sentences.forEach((sentence) => {
        this.sentences.push(sentence);
      });
    }
  }
}
