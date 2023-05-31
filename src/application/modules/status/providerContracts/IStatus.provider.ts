export interface IStatusProvider {
  get(context: string, date: string): Promise<string>;
}
