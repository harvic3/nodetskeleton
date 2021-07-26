import AppSettings from "../../application/shared/settings/AppSettings";
import AppWrapper from "./AppWrapper";
import * as http from "http";

export class HttpServer {
  #appWrapper: AppWrapper;
  server: http.Server;

  constructor(appWrapper: AppWrapper) {
    this.#appWrapper = appWrapper;
    this.server = http.createServer(this.#appWrapper.app);
  }

  listen(): void {
    this.#appWrapper
      .initializeServices()
      .then(() => {
        this.server.listen(AppSettings.ServerPort);
      })
      .catch((error) => {
        console.log("Server error", error);
      });

    this.server.on("listening", () => {
      console.log(
        `Server running on ${AppSettings.ServerHost}:${AppSettings.ServerPort}${AppSettings.ServerRoot}`,
      );
    });
  }
}
