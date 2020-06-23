export class Sentiment {
  constructor(polarity: number, type: string) {
    this.polarity = polarity;
    this.type = type;
  }
  polarity: number;
  type: string;
}
