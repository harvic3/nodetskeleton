import "express-async-errors";
import AppWrapper from "./infrastructure/app/AppWrapper";
import { HttpServer } from "./infrastructure/app/server/HttpServer";
import errorHandlerMiddleware from "./infrastructure/middleware/error";

const appWrapper = new AppWrapper();
const server = new HttpServer(appWrapper);
server.start();

process.on("uncaughtException", (error: NodeJS.UncaughtExceptionListener) => {
  errorHandlerMiddleware.manageNodeException("UncaughtException", error);
});

process.on("unhandledRejection", (reason: NodeJS.UnhandledRejectionListener) => {
  errorHandlerMiddleware.manageNodeException("UnhandledRejection", reason);
});
