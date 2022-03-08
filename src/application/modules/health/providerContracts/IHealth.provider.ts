export interface IHealthProvider {
  get(context: string, date: string): Promise<string>;
}
