export default class AppSettings {
  static Environment: string;

  static ServerPort: string;
  static ServerHost: string;
  static ServerOrigins: string;
  static ServerRoot: string;

  static init(config: { [key: string]: any }): void {
    this.Environment = config.Environment;

    this.ServerPort = config.server.Port;
    this.ServerHost = config.server.Host;
    this.ServerRoot = config.server.Root;
    this.ServerOrigins = config.server.Origins;
  }
}
