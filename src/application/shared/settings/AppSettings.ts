import { LocaleTypeEnum } from "../locals/LocaleType.enum";

export default class AppSettings {
  static readonly DEV: string = "dev";
  static readonly TEST: string = "testing";
  static readonly STAGING: string = "staging";
  static readonly PROD: string = "prod";
  static Environment: string;
  static ServiceContext: string;
  static ServiceName: string;
  static DefaultLanguage: LocaleTypeEnum;
  static EncryptionKey: string;
  static EncryptionIterations: number;
  static EncryptionKeySize: number;
  static ServerRoot: string;
  static ServerPort: number;
  static ServerHost: string;
  static ServerOrigins: string;
  static JWTEncryptionKey: string;
  static JWTExpirationTime: number;
  static DefaultHealthRemoteService: string;

  static init(config: Record<string, any>): void {
    this.Environment = config.Environment;
    this.ServiceContext = config.Server.ServiceContext.Context;
    this.ServiceName = config.Server.ServiceName;
    this.DefaultLanguage = config.Params.DefaultLanguage;
    this.EncryptionKey = config.Params.Security.CRYPTO.EncryptionKey;
    this.EncryptionIterations = config.Params.Security.CRYPTO.EncryptionIterations;
    this.EncryptionKeySize = config.Params.Security.CRYPTO.EncryptionKeySize;
    this.ServerRoot = config.Server.Root;
    this.ServerHost = config.Server.Host;
    this.ServerPort = config.Server.Port;
    this.ServerOrigins = config.Server.Origins;
    this.JWTEncryptionKey = config.Params.Security.JWT.SecretKey;
    this.JWTExpirationTime = config.Params.Security.JWT.ExpireInSeconds;
    this.DefaultHealthRemoteService = config.Params.DefaultHealthRemoteService;
  }

  static isDev(): boolean {
    return this.Environment === this.DEV;
  }
}
