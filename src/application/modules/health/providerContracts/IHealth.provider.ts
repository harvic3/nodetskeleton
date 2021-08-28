export interface IHealthProvider {
  get(date: string): Promise<string>;
}
