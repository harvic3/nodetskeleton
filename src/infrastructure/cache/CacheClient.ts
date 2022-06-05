import { Publisher, RedisConnection } from "../dataBases/redis/RedisConnection";
import { RedisConnectionOptions } from "../dataBases/redis/IRedisConnection";
import { ICacheClient } from "./ICacheClient";

export class CacheClient extends RedisConnection implements ICacheClient {
  constructor(serviceName: string, redisConnectionOptions: RedisConnectionOptions) {
    super(serviceName, redisConnectionOptions);
  }

  // async get(key: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     return this.publisher?.get(key, (error, data) => {
  //       if (error) return reject(error);
  //       return resolve(data as string);
  //     });
  //   });
  // }

  // async set(key: string, data: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     return this.publisher?.set(key, data, (error) => {
  //       if (error) return reject(BooleanUtil.FAILED);
  //       return resolve(BooleanUtil.YES);
  //     });
  //   });
  // }

  // async delete(key: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     return this.publisher?.del(key, (error) => {
  //       if (error) return reject(BooleanUtil.FAILED);
  //       return resolve(BooleanUtil.YES);
  //     });
  //   });
  // }

  // async setExpire(key: string, time: number): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     return this.publisher?.expire(key, time, (error) => {
  //       if (error) return reject(BooleanUtil.FAILED);
  //       return resolve(BooleanUtil.YES);
  //     });
  //   });
  // }

  getCacheClient(): Publisher | undefined {
    return this.initialized ? this.publisher : undefined;
  }

  disconnect(): void {
    this.close();
  }
}
