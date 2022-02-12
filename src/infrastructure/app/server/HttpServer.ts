import AppSettings from "../../../application/shared/settings/AppSettings";
import { Server, createServer } from "http";
import AppWrapper from "../AppWrapper";

export class HttpServer {
  #appWrapper: AppWrapper;
  server: Server;

  constructor(appWrapper: AppWrapper) {
    this.#appWrapper = appWrapper;
    this.server = createServer(this.#appWrapper.app);
  }

  start(): void {
    this.#appWrapper
      .initializeServices()
      .then(() => {
        this.server.listen(AppSettings.ServerPort);
      })
      .catch((error) => {
        console.log("Server starting error:", error);
      });

    this.server.on("listening", () => {
      console.log(
        `Server ${AppSettings.ServiceName} running on ${AppSettings.ServerHost}:${AppSettings.ServerPort}${AppSettings.ServerRoot}`,
      );
    });
  }
}
