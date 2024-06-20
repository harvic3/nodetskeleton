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

  start(start: Date): void {
    this.#appWrapper
      .initializeServices()
      .then(() => {
        this.server.listen(AppSettings.ServerPort);
      })
      .catch((error) => {
        console.log("Server starting error:", error);
      });

    this.server.on("listening", () => {
      this.#appWrapper.apiDocGenerator.saveApiDoc().dispose();
      console.log(`Server ${AppSettings.ServiceName} running on ${AppSettings.getServerUrl()}`);

      const seconds = ((new Date().valueOf() - start.valueOf()) / 1000).toFixed(3);
      console.log(
        `Started Application in ${process.uptime().toFixed(3)} seconds (${AppSettings.ServiceName} running for ${seconds})`,
      );
    });
  }
}
