export class NumberUtil {
  static isEvenNumber(value: number): boolean {
    return value % 2 === 0;
  }

  static getRandom(params: { min: number; max: number }): number {
    return Math.floor(Math.random() * (params.max - params.min + 1) + params.min);
  }
}
