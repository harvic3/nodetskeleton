export default class AppSettings {
  static DefaultLang: string;
  static EncryptionKey: string;
  static ServerRoot: string;
  static ServerPort: number;
  static ServerHost: string;
  static ServerOrigins: string;
  static JWTEncryptionKey: string;
  static JWTExpirationTime: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static init(config: { [key: string]: any }): void {
    this.DefaultLang = config.params.DefaultLang;
    this.EncryptionKey = config.params.security.EncryptionKey;
    this.ServerRoot = config.server.Root;
    this.ServerHost = config.server.Host;
    this.ServerPort = config.server.Port;
    this.ServerOrigins = config.server.Origins;
    this.JWTEncryptionKey = config.params.security.jwt.SecretKey;
    this.JWTExpirationTime = config.params.security.jwt.ExpireInSeconds;
  }
}
