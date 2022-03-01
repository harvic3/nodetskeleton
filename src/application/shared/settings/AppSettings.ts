export default class AppSettings {
  static ServiceContext: string;
  static ServiceName: string;
  static DefaultLang: string;
  static EncryptionKey: string;
  static EncryptionIterations: number;
  static EncryptionKeySize: number;
  static ServerRoot: string;
  static ServerPort: number;
  static ServerHost: string;
  static ServerOrigins: string;
  static JWTEncryptionKey: string;
  static JWTExpirationTime: number;

  static init(config: Record<string, any>): void {
    this.ServiceContext = config.Server.ServiceContext;
    this.ServiceName = config.Server.ServiceName;
    this.DefaultLang = config.Params.DefaultLang;
    this.EncryptionKey = config.Params.Security.CRYPTO.EncryptionKey;
    this.EncryptionIterations = config.Params.Security.CRYPTO.EncryptionIterations;
    this.EncryptionKeySize = config.Params.Security.CRYPTO.EncryptionKeySize;
    this.ServerRoot = config.Server.Root;
    this.ServerHost = config.Server.Host;
    this.ServerPort = config.Server.Port;
    this.ServerOrigins = config.Server.Origins;
    this.JWTEncryptionKey = config.Params.Security.JWT.SecretKey;
    this.JWTExpirationTime = config.Params.Security.JWT.ExpireInSeconds;
  }
}
