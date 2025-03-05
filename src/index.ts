import AppWrapper from "./infrastructure/app/AppWrapper";
import { HttpServer } from "./infrastructure/app/server/HttpServer";
import errorHandlerMiddleware from "./infrastructure/middleware/error";

const server = new HttpServer(new AppWrapper());
server.start(new Date());

process.on("uncaughtException", (error: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
  errorHandlerMiddleware.manageNodeException("UncaughtException", error, origin);
});

process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
  errorHandlerMiddleware.manageNodeRejection("UnhandledRejection", reason, promise);
});

process.on("exit", () => {
  console.info("[INFO]: Server is shutting down");
  server.stop();
});
