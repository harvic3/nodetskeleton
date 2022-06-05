import { CacheMessage } from "../CacheMessage";

export interface ICacheProvider {
  get<T>(key: string): Promise<CacheMessage<T>>;
  set<T>(key: string, data: T): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  setExpire(key: string, time: number): Promise<boolean>;
}
