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
        console.error(`[ERROR]: Server starting error: ${JSON.stringify(error)}`);
      });

    this.server.on("listening", () => {
      if (AppSettings.isDev())
        this.#appWrapper.apiDocGenerator.saveApiDoc(__dirname, "../../../../openapi.json").finish();

      const seconds = ((new Date().valueOf() - startAt.valueOf()) / 1000).toFixed(3);
      console.info(
        `Started Application in ${process.uptime().toFixed(3)} seconds (${AppSettings.ServiceName} running for ${seconds})`,
      );
      console.info(
        `Server ${AppSettings.ServiceName} running on ${this.#appWrapper.getServerUrl()}`,
      );
    });
  }

  stop(): void {
    this.server.close();
    this.#appWrapper.closeServices();
  }
}
