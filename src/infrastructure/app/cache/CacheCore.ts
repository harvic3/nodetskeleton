import { CacheProviderEnum } from "../../../adapters/providers/cache/CacheProvider.enum";
import { CacheProvider } from "../../../adapters/providers/cache/Cache.provider";
import AppSettings from "../../../application/shared/settings/AppSettings";
import { CacheClient } from "../../cache/CacheClient";
import kernel from "../../../adapters/shared/kernel";

export class CacheCore {
  tskAuthCache: CacheClient;

  constructor() {
    this.tskAuthCache = this.createCacheClient(
      AppSettings.AuthCacheConnection.Host,
      AppSettings.AuthCacheConnection.Port,
      AppSettings.AuthCacheConnection.DbIndex,
    );
  }

  private createCacheClient(host: string, port: number, dbIndex: number): CacheClient {
    const connectionOpts = {
      host,
      port,
      dbIndex,
    };
    return new CacheClient(CacheProviderEnum.AUTH, connectionOpts);
  }

  private createCacheProviders(): void {
    kernel.addSingleton(CacheProviderEnum.AUTH, new CacheProvider(this.tskAuthCache));
  }

  private initializeCacheSockets(): void {
    kernel.get<CacheProvider>(CacheCore.name, CacheProviderEnum.AUTH).initialize();
  }

  initialize(): void {
    this.createCacheProviders();
    this.initializeCacheSockets();
  }

  close(): void {
    this.tskAuthCache.disconnect();
  }
}
