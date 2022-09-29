import { LocaleTypeEnum } from "../locals/LocaleType.enum";

export default class AppSettings {
  static QUEUE_BASE_NAME = "queue";
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
  static MessageBusConnection: {
    Host: string;
    Port: number;
    DbIndex: number;
  };
  static MessageQueueConnection: {
    Host: string;
    Port: number;
    DbIndex: number;
  };

  static init(config: Record<string, any>): void {
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
    this.MessageBusConnection = config.Services.MessageBus;
    this.MessageQueueConnection = config.Services.MessageQueue;
  }
}
