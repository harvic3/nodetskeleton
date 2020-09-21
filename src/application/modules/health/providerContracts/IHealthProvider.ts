export interface IHealthProvider {
  Get(): Promise<string>;
}
