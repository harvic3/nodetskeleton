export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, data: T): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  expireIn(key: string, timeInSeconds: number): Promise<boolean>;
}
