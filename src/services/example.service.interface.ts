export interface IExampleService {
  sumTwoNumbers(numberA: number, numberB: number): number;
  sumArrayNumbers(numbers: number[]): Promise<number>;
}
