import { ICacheProvider } from "../../../application/shared/cache/providerContracts/ICache.provider";
import { CacheMessage } from "../../../application/shared/cache/CacheMessage";
import { Publisher } from "../../../infrastructure/messaging/MessageBus";
import { BooleanUtil } from "../../../domain/shared/utils/BooleanUtil";
import { ICacheClient } from "./ICacheClient";

export class CacheProvider implements ICacheProvider {
  #publisher: Publisher | undefined;

  constructor(private readonly cacheClient: ICacheClient) {}

  get<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      return this.#publisher?.get(key, (error, data) => {
        if (error) {
          console.error(`Error while getting key ${key} ${JSON.stringify(error)}`);
          return reject(null);
        }
        return resolve(CacheMessage.fromJSON<T>(data as string));
      });
    });
  }

  set<T>(key: string, data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.#publisher?.set(key, CacheMessage.toJSON<T>(data), (error) => {
        if (error) {
          console.error(`Error while setting key ${key} ${JSON.stringify(error)}`);
          return reject(BooleanUtil.FAILED);
        }
        return resolve(BooleanUtil.SUCCESS);
      });
    });
  }

  delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.#publisher?.del(key, (error) => {
        if (error) {
          console.error(`Error while deleting key ${key} ${JSON.stringify(error)}`);
          return reject(BooleanUtil.FAILED);
        }
        return resolve(BooleanUtil.SUCCESS);
      });
    });
  }

  expireIn(key: string, timeInSeconds: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.#publisher?.expire(key, timeInSeconds, (error) => {
        if (error) {
          console.error(
            `Error while expiring key ${key} in ${timeInSeconds} seconds ${JSON.stringify(error)}`,
          );
          return reject(BooleanUtil.FAILED);
        }
        return resolve(BooleanUtil.SUCCESS);
      });
    });
  }

  initialize(): void {
    if (!this.cacheClient) return;

    this.#publisher = this.cacheClient.getCacheClient() as Publisher;

    this.#publisher?.on("connect", () => {
      console.log(`Publisher ${this.cacheClient.serviceName} CONNECTED`);
    });

    this.#publisher?.on("error", (error) => {
      console.error(
        `Publisher ${this.cacheClient.serviceName} service error ${new Date().toISOString()}:`,
        error,
      );
    });
  }
}