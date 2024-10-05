import AppSettings from "../../../application/shared/settings/AppSettings";
import { Server, createServer } from "http";
import AppWrapper from "../AppWrapper";

export class HttpServer {
  readonly #appWrapper: AppWrapper;
  readonly server: Server;

  constructor(appWrapper: AppWrapper) {
    this.#appWrapper = appWrapper;
    this.server = createServer(this.#appWrapper.app);
  }

  start(startAt: Date): void {
    this.#appWrapper
      .initializeServices()
      .then(() => {
        this.server.listen(AppSettings.ServerPort);
      })
      .catch((error) => {
        console.log("Server starting error:", error);
      });

    this.server.on("listening", () => {
      if (AppSettings.isDev())
        this.#appWrapper.apiDocGenerator.saveApiDoc(__dirname, "../../../../openapi.json").finish();

      console.log(
        `Server ${AppSettings.ServiceName} running on ${this.#appWrapper.getServerUrl()}`,
      );

      const seconds = ((new Date().valueOf() - startAt.valueOf()) / 1000).toFixed(3);
      console.log(
        `Started Application in ${process.uptime().toFixed(3)} seconds (${AppSettings.ServiceName} running for ${seconds})`,
      );
    });
  }
}
