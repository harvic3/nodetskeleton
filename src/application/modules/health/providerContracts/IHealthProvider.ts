export interface IHealthProvider {
  get(): Promise<string>;
}
